import { Injectable } from "@angular/core";
// Hacky import to fix lack of types when importing from dist and broken default import
import * as PouchDBDist from "pouchdb/dist/pouchdb";
import * as PouchDBDefault from "pouchdb";
import { BehaviorSubject } from "rxjs";
import { ISessionMeta, IDayMeta, IDBDoc } from "src/types";
const PouchDB: typeof PouchDBDefault = PouchDBDist;

const DB_USER = "somanyumbani_app";
const DB_PASS = "somanyumbani_app";
const DB_DOMAIN = "db.somanyumbani.com";
const localDBs = {
  sessions: new PouchDB("somanyumbani_sessions"),
  days: new PouchDB("somanyumbani_days"),
};
const remoteDBs = {
  sessions: new PouchDB(
    `https://${DB_USER}:${DB_PASS}@${DB_DOMAIN}/somanyumbani_sessions`
  ),
  days: new PouchDB(
    `https://${DB_USER}:${DB_PASS}@${DB_DOMAIN}/somanyumbani_days`
  ),
};

@Injectable({
  providedIn: "root",
})
export class DbService {
  /***************************************************************************
   * Public Variables
   * These can be accessed directly by components.
   * Varaibles ending '$' denote dynamic variables that will change as the
   * database is populated, and so should be used with an async pipe to track
   * ```
   * <div *ngFor="let session of dbService.sessions$ | async">
   * ```
   ***************************************************************************/
  sessions$ = new BehaviorSubject<{
    [sessionId: string]: ISessionMeta & IDBDoc;
  }>({});
  days$ = new BehaviorSubject<(IDayMeta & IDBDoc)[]>([]);

  constructor() {
    this.initDBService();
  }
  /***************************************************************************
   * Public Methods
   * These can be called by other components or services
   ***************************************************************************/
  /**
   * Sync the attachment from a server doc to a local doc
   * Required for custom sync protocol where attachments aren't automatically replicated
   */
  public async downloadAttachment(
    endpoint: IDBEndpoint,
    docId: string,
    attachmentId: string
  ) {
    const attachment = await remoteDBs[endpoint].getAttachment(
      docId,
      attachmentId
    );
    const { _rev } = await localDBs[endpoint].get(docId);
    await localDBs[endpoint].putAttachment(
      docId,
      attachmentId,
      _rev,
      attachment,
      "text/plain"
    );
  }

  public getAttachment(
    endpoint: IDBEndpoint,
    docId: string,
    attachmentId: string
  ) {
    return localDBs[endpoint].getAttachment(docId, attachmentId);
  }

  /***************************************************************************
   * Private Methods
   * These are used internally to manage the database
   ***************************************************************************/

  /**
   * load saved active day, load database for each endpoint and sync with server
   */
  private initDBService() {
    Object.keys(localDBs).forEach((endpoint) =>
      this.loadDB(endpoint as IDBEndpoint)
    );
    this.syncRemoteDBs();
  }

  /**
   * Bootstrap script to populate local variables with database values
   * for access by display components
   */
  private async loadDB(endpoint: IDBEndpoint) {
    const { rows } = await localDBs[endpoint].allDocs<any>({
      attachments: false,
      include_docs: true,
    });
    const docs = rows.map((r) => r.doc);
    switch (endpoint) {
      case "days":
        return this.days$.next(docs);
      case "sessions":
        const sessions = {};
        docs.forEach((d) => (sessions[d._id] = d));
        return this.sessions$.next(sessions);
    }
  }

  /**
   * Handle data replication between server and client
   * Note - endpoints are handled differently depending on whetheer we want to include attached
   * docs during replication or not
   */
  private syncRemoteDBs() {
    this._replicateRemoteDB("days");
    this._replicateRemoteDBWithoutAttachments("sessions");
  }
  /**
   * Use PouchDB replicate method for a 1-way sync from server to local DB
   */
  private _replicateRemoteDB(endpoint: IDBEndpoint) {
    PouchDB.replicate(remoteDBs[endpoint], localDBs[endpoint], {
      live: true,
      retry: true,
      batch_size: 50,
    })
      .on("change", (info) => this.loadDB(endpoint as IDBEndpoint))
      .on("paused", (err) => console.log("sync paused", endpoint, err))
      .on("active", () => console.log("sync active", endpoint))
      .on("denied", (err) => console.log("sync denied", endpoint, err))
      .on("complete", (info) => console.log("sync complete", endpoint, info))
      .on("error", (err) => {
        console.error(endpoint, err);
        throw new Error(`${endpoint} sync error: ${err}`);
        // handle error
      });
  }
  /**
   * Custom replication method to allow 1-way sync from server to client, but
   * without automatically including attachments (allow manual download later)
   */
  private async _replicateRemoteDBWithoutAttachments(endpoint: IDBEndpoint) {
    console.log("replicating without attachments", endpoint);
    const local = localDBs[endpoint];
    // Retrieve all changes in batch since last update
    const latestSeq = await this._getLatestChangeSeq(local);
    const changes = await remoteDBs[endpoint].changes<any>({
      attachments: false,
      since: latestSeq,
      batch_size: 200,
      include_docs: true,
    });
    await this._processCustomDBChanges(local, changes.results);
    await this.loadDB(endpoint);
    // Stream future changes
    const updatedLatestSeq = await this._getLatestChangeSeq(local);
    await remoteDBs[endpoint]
      .changes<any>({
        attachments: false,
        since: updatedLatestSeq,
        batch_size: 1,
        include_docs: true,
        live: true,
      })
      .on("change", (update) => {
        console.log("change", update);
        this._processCustomDBChanges(local, [update]);
        this.loadDB(endpoint);
      })
      .on("error", (err) => {
        console.error(endpoint, err);
        throw new Error(`${endpoint} sync error: ${err}`);
      });
  }
  /**
   * Simple method to retrieve the latest edited document in the database
   */
  async _getLatestChangeSeq(db: PouchDB.Database) {
    const latest = await db.changes<any>({
      limit: 1,
      descending: true,
      include_docs: true,
    });
    const seq = latest.results[0] ? latest.results[0].doc.seq : 0;
    return seq;
  }

  /**
   * Extract _attachments stub and save to 'attachments' so that they can be persisted to the database
   * without the full downloaded attachment
   * Add the remote database 'seq' identifier to keep track of the latest remote and local changes
   */
  async _processCustomDBChanges(
    db: PouchDB.Database,
    changes: PouchDB.Core.ChangesResponseChange<any>[]
  ) {
    const docs = changes
      .filter((c) => c.id[0] !== "_")
      .map((c) => {
        const { doc, seq } = c;
        if (doc.hasOwnProperty("_attachments")) {
          doc.attachments = doc._attachments;
          delete doc._attachments;
        }
        doc.seq = seq;
        return doc;
      });
    for (const doc of docs) {
      await db.put(doc, { force: true });
    }
  }
}
export type IDBEndpoint = keyof typeof localDBs;
