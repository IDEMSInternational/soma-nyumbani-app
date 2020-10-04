import { Injectable } from "@angular/core";
import { FirebaseCrashlyticsWeb } from "@capacitor-community/firebase-crashlytics";
import { Plugins, Capacitor } from "@capacitor/core";
import { UserService } from "./user.service";

const FirebaseCrashlytics = Plugins.FirebaseCrashlytics as FirebaseCrashlyticsWeb;

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(private userService: UserService) {}
  init() {
    if (Capacitor.isNative) {
      FirebaseCrashlytics.setEnabled({
        enabled: true,
      });
      console.log("error service enabled");
      this._subscribeToUserUpdates();
      FirebaseCrashlytics.addLogMessage({
        message: "This is a test message: Capacitor is awesome! 😃",
      });
    }
  }

  _subscribeToUserUpdates() {
    this.userService.user$.subscribe((user) => {
      if (user && user.uid) {
        FirebaseCrashlytics.setUserId({ userId: user.uid });
      }
    });
  }
}
