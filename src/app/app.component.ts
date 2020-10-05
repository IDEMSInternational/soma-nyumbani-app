import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";
import { AnalyticsService } from "./services/analytics.service";
import { UserService } from "./services/user.service";
import { environment } from "src/environments/environment";
import { DbService } from "./services/db.service";
import { ActivatedRoute } from "@angular/router";
import { ErrorService } from "./services/error.service";
const { SplashScreen } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  APP_VERSION = environment.APP_VERSION;
  // don't show tutorial is somebody is directly navigating to policies, e.g. google bot
  skipTutorial = ["/privacy", "/terms"].includes(location.pathname);
  constructor(
    private platform: Platform,
    private analyticsService: AnalyticsService,
    private dbService: DbService,
    public route: ActivatedRoute,
    public userService: UserService,
    private errorService: ErrorService
  ) {
    this.initializeApp();
    console.log("route", route.snapshot);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.analyticsService.init();
      this.userService.init();
      this.dbService.init();
      this.errorService.init();
      if (Capacitor.isNative) {
        SplashScreen.hide();
      }
    });
  }
}
