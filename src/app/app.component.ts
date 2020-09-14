import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { AnalyticsService } from "./services/analytics.service";
import { UserService } from "./services/user.service";
import { environment } from "src/environments/environment";
const { SplashScreen } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  APP_VERSION = environment.APP_VERSION;
  constructor(
    private platform: Platform,
    private analyticsService: AnalyticsService,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.analyticsService.init();
      this.userService.init();
    });
  }
}
