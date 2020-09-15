import { Component, Input } from "@angular/core";
import { ISessionMeta, IDBDoc } from "src/types";
import { FileService } from "src/app/services/file.service";

@Component({
  selector: "app-session-summary-card",
  styles: [
    `
      :host {
        display: block;
      }
      .session-card {
        margin: 0;
        height: 100%;
        width: 100%;
        padding: 1em;
      }
    `,
  ],
  template: `
    <ion-card class="ion-padding" *ngIf="_session" class="session-card">
      <ion-card-title>Session: {{ index + 1 }}</ion-card-title>
      <ion-card-subtitle>{{ _session.title }}</ion-card-subtitle>
      <ion-card-content>{{ _session.description }}</ion-card-content>
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
export class SessionSummaryCardComponent {
  @Input() set session(session: ISessionMeta & IDBDoc) {
    if (session) {
      this._session = session;
      this.attachments = this._prepareAttachments(session);
    }
  }
  @Input() index: number;
  attachments: any[];
  public _session: ISessionMeta;
  constructor(public fileService: FileService) {}

  _prepareAttachments(session: ISessionMeta & IDBDoc) {
    const attachments = session._attachments || {};
    return Object.entries(attachments).map(([attachmentId, meta]) => ({
      docId: session._id,
      attachmentId,
      ...meta,
    }));
  }
}
