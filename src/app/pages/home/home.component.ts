import { Component, OnInit } from "@angular/core";
import { DbService } from "src/app/services/db.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(public db: DbService) {}

  ngOnInit(): void {}
}
