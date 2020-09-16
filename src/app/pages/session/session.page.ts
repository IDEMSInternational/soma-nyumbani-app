import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DbService } from "src/app/services/db.service";

@Component({
  selector: "app-session",
  templateUrl: "./session.page.html",
  styleUrls: ["./session.page.scss"],
})
export class SessionPage {
  dayId: number;
  sessionNumber: number;
  constructor(
    route: ActivatedRoute,
    private router: Router,
    public db: DbService
  ) {
    this.dayId = Number(route.snapshot.params.dayId || 1);
    this.sessionNumber = Number(route.snapshot.params.sessionId || 1);
  }

  goToSession(sessionId: number) {
    this.router.navigate(["day", this.dayId, "session", sessionId]);
  }
}
