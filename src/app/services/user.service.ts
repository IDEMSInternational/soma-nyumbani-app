import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { cfaSignIn, cfaSignOut } from "capacitor-firebase-auth";

import { BehaviorSubject } from "rxjs";
import {
  IUser,
  DEFAULT_USER,
  IUserMeta,
  IUserSubcollections,
} from "src/models";
import { AnalyticsService } from "./analytics.service";

@Injectable({
  providedIn: "root",
})
/**
 * The user service handles login and user document sync
 * Native code requirements for auth:
 * https://www.npmjs.com/package/capacitor-firebase-auth
 * Also if signing via google play, ensure correct sha:1
 * added from google play store to firebase
 */
export class UserService {
  user$ = new BehaviorSubject<IUser>(DEFAULT_USER);
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private analytics: AnalyticsService
  ) {
    const user = localStorage.getItem("user");
    if (user) {
      this.user$.next(JSON.parse(user));
    }
  }

  get user() {
    return this.user$.value;
  }

  init() {
    this._subscribeToAuthUpdates();
  }

  signIn() {
    // Use native capacitor firebase auth sign in with google provider
    // auth state changes still handled by generic listener
    cfaSignIn("google.com").subscribe((user) => console.log("user", user));
  }

  /**
   * Update core user meta data
   * @param update - Fields to update on the user
   * @param sync - Whether to sync with online server immediately
   */
  updateUser(update: Partial<IUserMeta>, sync = true) {
    const user = { ...this.user, ...update };
    this.saveUser(user, sync);
  }
  /**
   * Update docs within user subcollection
   */
  updateUserDoc(
    collection: keyof IUserSubcollections,
    docId: string,
    update: { [docId: string]: any },
    sync = true
  ) {
    console.log("update user doc", collection, docId, update);
    const user = { ...this.user };
    user[collection as any][docId] = update;
    this.saveUser(user, sync);
  }

  private saveUser(user: IUser, sync = true) {
    console.log("saving user", user);
    const _lastModified = new Date().toISOString();
    user = { ...user, _lastModified };
    localStorage.setItem("user", JSON.stringify(user));
    this.user$.next(user);
    if (sync) {
      this.syncUser(this.user);
    }
  }

  /**
   * Sign user out, but retain locally stored data
   */
  signOutUser() {
    cfaSignOut().subscribe((e) => console.log("signed out", e));
  }

  /**
   * TODO - possibly better to trigger on daily check, rather than writes
   */
  private syncUser(user: IUser) {
    // TODO - sync subcollection docs (e.g. reports) to proper location
    const { uid } = user;
    if (uid) {
      this.firestore.collection("users").doc(uid).set(user);
    }
  }

  private _subscribeToAuthUpdates() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        console.log("user signed in");
        const { uid, displayName } = user;
        this.updateUser({ uid, displayName }, false);
        this.analytics.setUserID(uid);
        // const ref = this.firestore.collection("users").doc<IUser>(uid);
        // TODO - subscribe to user updates (currently just 1-time fetch)
        // const doc = await ref.get().toPromise();
        // if (doc.exists) {
        //   // TODO - sync user from server - make sure not to overwrite existing data
        //   // e.g. sync'd some reports on one device, and then used another and
        //   // want to re-sync
        //   // this.updateUser(doc.data() as IUser, false);
        // } else {
        //   this.updateUser({ uid, displayName });
        // }
      } else {
        console.log("user not signed in");
        const uid = null;
        const displayName = null;
        this.updateUser({ uid, displayName }, false);
      }
    });
  }
}
