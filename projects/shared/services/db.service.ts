import { Injectable } from "@angular/core";
import * as PouchDB from "pouchdb/dist/pouchdb";
// PouchDB.plugin(require('pouchdb-authentication'));

@Injectable({
  providedIn: "root",
})
export class DbService {
  localDB = new PouchDB("somanyumbani");
  remoteDB = new PouchDB(
    "https://somanyumbani:somanyumbani@db.somanyumbani.com"
  );
  constructor() {
    console.log("local", this.localDB);
    console.log("remote", this.remoteDB);
    this._syncRemoteDB();
  }

  private _syncRemoteDB() {
    // this.localDB.logIn('somanyumbani', 'somanyumbani').then(() => {
    //   console.log('logged into db');
    // });
    this.localDB.replicate
      .from(this.remoteDB)
      .on("complete", () => {
        // yay, we're done!
        console.log("replication complete");
      })
      .on("error", () => {
        // boo, something went wrong!
      });
  }
}
