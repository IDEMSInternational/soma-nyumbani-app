import { Component } from "@angular/core";
import { DbService } from "../../services/db.service";

@Component({
  selector: "app-day",
  templateUrl: "./day.page.html",
  styleUrls: ["./day.page.scss"],
})
export class DayPage {
  constructor(public db: DbService) {}
}
