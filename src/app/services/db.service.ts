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
    this._syncRemoteDBs();
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
   * Establish a connection to remote database and synchronise documents
   */
  private _syncRemoteDBs() {
    Object.keys(localDBs).forEach((endpoint) => {
      const remote = `https://${DB_USER}:${DB_PASS}@${DB_DOMAIN}/somanyumbani_${endpoint}`;
      PouchDB.replicate(remote, localDBs[endpoint], {
        live: true,
        retry: true,
        batch_size: 1,
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
    });
  }
}
export type IDBEndpoint = keyof typeof localDBs;
