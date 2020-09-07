import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { DbService } from "../services/db.service";
import { ISessionActivity } from "src/types";

@Component({
  selector: "app-session-activity",
  template: `<div *ngIf="activity">Activity:{{ activity.title }}</div>`,
})
export class SessionActivityComponent implements OnInit, OnDestroy {
  @Input() activity: ISessionActivity;
  constructor() {}

  ngOnInit() {
    console.log("getting activity", this.activity);
  }
  ngOnDestroy() {}
}
