import { Component, Input } from "@angular/core";
import { ISessionActivity, IDBDoc } from "src/types";
import { FileService } from "../services/file.service";

@Component({
  selector: "app-session-activity",
  styles: [
    `
      :host {
        display: block;
      }
      .activity-card {
        margin: 0;
        height: 100%;
        width: 100%;
        padding: 1em;
      }
    `,
  ],
  template: `
    <ion-card class="ion-padding" *ngIf="_activity" class="activity-card">
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
        <span style="max-width:150px;overflow:hidden;text-overflow:ellipsis">{{
          attachment.attachmentId
        }}</span>
      </ion-button>
    </ion-card>
  `,
})
export class SessionActivityComponent {
  @Input() set activity(activity: ISessionActivity & IDBDoc) {
    if (activity) {
      this._activity = activity;
      this.attachments = this._prepareAttachments(activity);
    }
  }
  @Input() index: number;
  attachments: any[];
  public _activity: ISessionActivity;
  constructor(public fileService: FileService) {}

  _prepareAttachments(activity: ISessionActivity & IDBDoc) {
    const attachments = activity._attachments || {};
    return Object.entries(attachments).map(([attachmentId, meta]) => ({
      docId: activity._id,
      attachmentId,
      ...meta,
    }));
  }
}
