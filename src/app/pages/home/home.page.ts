import { Component } from "@angular/core";
import { DbService } from "src/app/services/db.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(public db: DbService) {}
}
