import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import "@capacitor-community/firebase-analytics";
import { FirebaseAnalyticsWeb } from "@capacitor-community/firebase-analytics";
import { Plugins, Capacitor } from "@capacitor/core";
import { takeWhile } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UserService } from "./user.service";
const { FirebaseAnalytics } = Plugins;
const Analytics = FirebaseAnalytics as FirebaseAnalyticsWeb;

@Injectable({
  providedIn: "root",
})
/**
 * Provides native Analytics tracking via firebase analytics
 * NOTE - could be handled just using javascript sdk, however we would lose
 * native device information (e.g. OS, app version etc.)
 */
export class AnalyticsService {
  analyticsEnabled = false;
  constructor(private router: Router, private userService: UserService) {}

  /**
   *  Initialise analytics to track route changes and share data
   *  Note - requires installation and initialisation of analytics sdk
   *  and google services json
   *  API - https://github.com/capacitor-community/firebase-analytics
   */
  async init() {
    await this._waitForAnalyticsConsent();
    if (this.userService.user && this.userService.user.uid) {
      this.setUserID(this.userService.user.uid);
    }
    if (!Capacitor.isNative) {
      Analytics.initializeFirebase(environment.FIREBASE_CONFIG);
    }
    this.analyticsEnabled = true;
    this._subscribeToRouteChanges();
  }
  /**
   * Record an event to firebase analytics
   * @param name - event name to record in firebase (can be anything)
   * @param params - optional key:value mapping to include in analytics
   */
  logEvent(name: string, params: any = {}) {
    if (this.analyticsEnabled) {
      Analytics.logEvent({ name, params });
    }
  }
  setUserID(id: string) {
    if (this.analyticsEnabled) {
      Analytics.setUserId({
        userId: id,
      });
    }
  }
  /**
   * Listen to user changes until they have consented to analytics, then resolve
   */
  async _waitForAnalyticsConsent() {
    return this.userService.user$
      .pipe(takeWhile((user) => user.analyticsConsent !== true))
      .toPromise();
  }

  /**
   * Log and report on page navigation events
   */
  private _subscribeToRouteChanges() {
    this.router.events.subscribe(async (e) => {
      if (e instanceof NavigationEnd) {
        Analytics.setScreenName({
          screenName: e.url,
          nameOverride: null,
        });
        this.logEvent("page_view", { url: e.url });
      }
    });
  }
}
