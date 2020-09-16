import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import "@capacitor-community/firebase-analytics";
import { FirebaseAnalyticsWeb } from "@capacitor-community/firebase-analytics";
import { Plugins, Capacitor } from "@capacitor/core";
import { AlertController, PopoverController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { AnalyticsConsentComponent } from "../components/analyticsConsent";
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
  constructor(private router: Router, private popover: PopoverController) {}

  /**
   *  Initialise analytics to track route changes and share data
   *  Note - requires installation and initialisation of analytics sdk
   *  and google services json
   *  API - https://github.com/capacitor-community/firebase-analytics
   */
  async init() {
    const consented = await this.verifyUserAnalyticsConsent();
    if (consented) {
      if (!Capacitor.isNative) {
        Analytics.initializeFirebase(environment.FIREBASE_CONFIG);
      }
      this.analyticsEnabled = true;
      console.info("analytics enabled");
      this._subscribeToRouteChanges();
    } else {
      console.info("analytics disabled");
    }
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
   * Track locally if user has consented to analytics. Present dialog to
   * receive consent if not asked.
   *
   * By default hide from robots (for seo purposes)
   */
  private async verifyUserAnalyticsConsent(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const userConsented = localStorage.getItem("analytics_user_consented");
      const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(
        navigator.userAgent
      );
      if (userConsented || isBot) {
        resolve(userConsented === "true" ? true : false);
      } else {
        const consented = await this.showConsentDialog();
        // localStorage.setItem("analytics_user_consented", `${consented}`);
        resolve(consented);
      }
    });
  }

  private async showConsentDialog() {
    const popover = await this.popover.create({
      cssClass: "my-custom-class",
      component: AnalyticsConsentComponent,
      backdropDismiss: false,
    });

    await popover.present();
    const consented: boolean = (await popover.onDidDismiss()).data;
    console.log("consented", consented);
    return consented;
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
