import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DbService } from "src/app/services/db.service";
import { UserService } from "src/app/services/user.service";
import { ISessionMeta } from "src/models";

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

  goToSession(session: ISessionMeta) {
    const { day_number, session_number, slug } = session;
    this.router.navigate(["/report"], {
      queryParams: { day_number, session_number, selectedSession: slug },
    });
  }
}
