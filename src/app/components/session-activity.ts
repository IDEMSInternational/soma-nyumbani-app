import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ISessionActivity, IDBDoc } from "src/types";
import { FileService } from "../services/file.service";

@Component({
  selector: "app-session-activity",
  template: `
    <ion-card class="ion-padding" *ngIf="_activity">
      <ion-card-title>Session: {{ index + 1 }}</ion-card-title>
      <ion-card-subtitle>{{ _activity.title }}</ion-card-subtitle>
      <ion-card-content>{{ _activity.description }}</ion-card-content>
      <ion-button
        *ngFor="let attachment of attachments"
        (click)="fileService.openAttachment(attachment)"
        fill="outline"
        color="primary"
      >
        <ion-icon slot="start" src="assets/icons/pdf.svg"></ion-icon>
        {{ attachment.attachmentId }}
      </ion-button>
    </ion-card>
  `,
})
export class SessionActivityComponent implements OnInit, OnDestroy {
  @Input() set activity(activity: ISessionActivity & IDBDoc) {
    if (activity) {
      console.log("set activity", activity);
      this._activity = activity;
      this.attachments = this._prepareAttachments(activity);
      console.log("attachments", this.attachments);
    }
  }
  @Input() index: number;
  attachments: any[];
  public _activity: ISessionActivity;
  constructor(public fileService: FileService) {}
  ngOnInit() {
    console.log("init", this.activity);
  }
  ngOnDestroy() {}

  _prepareAttachments(activity: ISessionActivity & IDBDoc) {
    const attachments = activity._attachments || {};
    return Object.entries(attachments).map(([attachmentId, meta]) => ({
      docId: activity._id,
      attachmentId,
      ...meta,
    }));
  }
}