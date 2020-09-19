import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { auth } from "firebase/app";
import { BehaviorSubject } from "rxjs";
import { IUser, DEFAULT_USER } from "src/models";

@Injectable({
  providedIn: "root",
})
export class UserService {
  user$ = new BehaviorSubject<IUser>(DEFAULT_USER);
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
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
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(provider);
  }

  /**
   *
   * @param update - Fields to update on the user
   * @param sync - Whether to sync with online server immediately
   */
  updateUser(update: Partial<IUser>, sync = true) {
    this.user$.next({ ...this.user, ...update });
    localStorage.setItem("user", JSON.stringify(this.user));
    if (sync) {
      this.syncUser(this.user);
    }
  }

  /**
   *  Remove all locally stored data and sign out user from device
   */
  signOutUser() {
    localStorage.removeItem("user");
    this.user$.next(DEFAULT_USER);
    this.afAuth.signOut();
  }

  private syncUser(user: IUser) {
    const { uid } = user;
    if (uid) {
      this.firestore.collection("users").doc(uid).set(user);
    }
  }

  private _subscribeToAuthUpdates() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        console.log("user signed in, retrieving profile", user);
        const { uid } = user;
        const ref = this.firestore.collection("users").doc<IUser>(uid);
        // TODO - subscribe to user updates (currently just 1-time fetch)
        const doc = await ref.get().toPromise();
        if (doc.exists) {
          // TODO - handle case where local changes exist and differ from server
          // e.g. sync'd some reports on one device, and then used another and
          // want to re-sync
          this.updateUser(doc.data() as IUser, false);
        } else {
          this.updateUser({ uid });
        }
      }
    });
  }
}
