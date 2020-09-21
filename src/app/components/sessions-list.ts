import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DbService } from "../services/db.service";

@Component({
  selector: "app-sessions-list",
  template: `
    <ion-list>
      <ion-item
        button
        *ngFor="let session of db.sessions$ | async"
        class="bg-white hover-secondary"
        (click)="selectSession(session._id)"
      >
        <ion-label>{{ session.title }}</ion-label>
        <ion-checkbox
          slot="end"
          [checked]="selectedSession === session._id"
        ></ion-checkbox>
      </ion-item>
    </ion-list>
  `,
})
export class SessionsListComponent {
  @Input() selectedSession: string;
  @Output() selectedSessionChange = new EventEmitter();
  constructor(public db: DbService) {}

  selectSession(id: string) {
    if (this.selectedSession === id) {
      this.selectedSession = null;
    } else {
      this.selectedSession = id;
    }
    this.selectedSessionChange.next(this.selectedSession);
  }
}
