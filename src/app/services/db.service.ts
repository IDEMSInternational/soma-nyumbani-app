import { Injectable } from "@angular/core";
// Hacky import to fix lack of types when importing from dist and broken default import
import * as PouchDBDist from "pouchdb/dist/pouchdb";
import * as PouchDBDefault from "pouchdb";
import { BehaviorSubject } from "rxjs";
import { ISessionActivity, IDailySession, IDBDoc } from "src/types";
const PouchDB: typeof PouchDBDefault = PouchDBDist;

const DB_USER = "somanyumbani_app";
const DB_PASS = "somanyumbani_app";
const DB_DOMAIN = "db.somanyumbani.com";
const localDBs = {
  activities: new PouchDB("somanyumbani_activities"),
  daily_sessions: new PouchDB("somanyumbani_daily_sessions"),
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
   * <div *ngFor="let activity of dbService.activities | async">
   * ```
   ***************************************************************************/
  activeDay: number;
  activities$ = new BehaviorSubject<{
    [activityId: string]: ISessionActivity & IDBDoc;
  }>({});
  dailySessions$ = new BehaviorSubject<(IDailySession & IDBDoc)[]>([]);

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

  public setActiveDay(index: number) {
    localStorage.setItem("activeDay", index.toString());
    this.activeDay = index;
  }

  /***************************************************************************
   * Private Methods
   * These are used internally to manage the database
   ***************************************************************************/

  /**
   * load saved active day, load database for each endpoint and sync with server
   */
  private initDBService() {
    this.activeDay = Number(localStorage.getItem("activeDay") || "1");
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
      case "activities":
        const activitiesHash = {};
        docs.forEach((d) => (activitiesHash[d._id] = d));
        return this.activities$.next(activitiesHash);
      case "daily_sessions":
        return this.dailySessions$.next(docs);
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
type IDBEndpoint = keyof typeof localDBs;
