import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class UserService {
  user: IUser;
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  init() {
    this.loadUser();
    this._subscribeToAuthUpdates();
  }

  loadUser() {
    const user = localStorage.getItem("user");
    this.user = user ? JSON.parse(user) : DEFAULT_USER;
  }

  updateUser(update: any) {
    this.user = { ...this.user, ...update };
    this.syncUser(this.user);
  }

  /**
   *  Remove all locally stored data and sign out user from device
   */
  signOutUser() {
    localStorage.removeItem("user");
    this.user = undefined;
    this.auth.signOut();
  }

  private syncUser(user: IUser) {
    console.log("syncing user", user);
    const { uid } = user;
    if (user) {
      this.firestore.collection("users").doc(uid).set(user);
    }
  }

  private _subscribeToAuthUpdates() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        const { uid } = user;
        this.updateUser(uid);
        this.user = { ...this.user, uid };
      }
    });
  }
}

interface IUser {
  uid?: string; // populated by auth on registration
  activeDay: number;
}

const DEFAULT_USER: IUser = {
  activeDay: 1,
};
