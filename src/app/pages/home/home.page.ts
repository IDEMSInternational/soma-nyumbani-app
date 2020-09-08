import { Component } from "@angular/core";
import { DbService } from "src/app/services/db.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  APP_VERSION = environment.APP_VERSION;
  constructor(public db: DbService) {}
}
