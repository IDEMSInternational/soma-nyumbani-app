import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { DbService } from "src/app/services/db.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-day",
  templateUrl: "./day.page.html",
  styleUrls: ["./day.page.scss"],
})
export class DayPage {
  dayId: number;
  constructor(
    public db: DbService,
    public userService: UserService,
    route: ActivatedRoute,
    private router: Router
  ) {
    this.dayId = Number(route.snapshot.params.dayId || 1);
  }

  goToDay(dayId: number) {
    this.router.navigate(["day", dayId]);
  }
}
