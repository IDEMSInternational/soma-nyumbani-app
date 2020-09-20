import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DbService } from "src/app/services/db.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  setActiveDay(activeDay: number) {
    console.log("set active day", activeDay);
    this.userService.updateUser({ activeDay });
  }
  constructor(
    public db: DbService,
    public userService: UserService,
    private router: Router
  ) {}

  goToSession(session) {
    this.router.navigate(["/report"]);
  }
}
