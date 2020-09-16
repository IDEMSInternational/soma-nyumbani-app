import { Component, Input, OnInit } from "@angular/core";
import { DbService } from "src/app/services/db.service";
import { FileService } from "src/app/services/file.service";
import { ICustomAttachment, IDBDoc, ISessionMeta } from "src/types";

@Component({
  selector: "app-session-attachments",
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <ion-card
      *ngFor="let attachment of attachments; index as i"
      button
      (click)="handleAttachmentClick(attachment, i)"
    >
      <div style="display:flex; align-items:center">
        <ion-card-header style="flex:1">
          <ion-card-subtitle style="font-weight:bold; margin-bottom:1em">
            {{ attachment.attachmentId }}
          </ion-card-subtitle>
          <div>
            <div>{{ attachment.content_type }}</div>
            <div>{{ attachment.length | fileSize }}</div>
          </div>
        </ion-card-header>
        <ion-icon
          [name]="attachment.isDownloaded ? 'open-outline' : 'download'"
          *ngIf="!isDownloading[attachment.attachmentId]"
          style="font-size:2em; margin-right:1em"
          [color]="attachment.isDownloaded ? 'secondary' : 'primary'"
        ></ion-icon>
        <ion-spinner
          name="crescent"
          *ngIf="isDownloading[attachment.attachmentId]"
          style="font-size:2em; margin-right:1em"
        ></ion-spinner>
      </div>
    </ion-card>
  `,
})
export class SessionAttachmentsComponent implements OnInit {
  isDownloading = {};
  attachments: ICustomAttachment[] = [];
  @Input() session: ISessionMeta & IDBDoc;
  constructor(public fileService: FileService, public db: DbService) {}

  ngOnInit() {
    this._prepareAttachments(this.session);
  }

  handleAttachmentClick(attachment: ICustomAttachment, index: number) {
    if (this.isDownloading[attachment.attachmentId]) {
      return;
    }
    if (attachment.isDownloaded) {
      this.fileService.openAttachment(attachment);
    } else {
      this.downloadAttachment(attachment, index);
    }
  }

  private async downloadAttachment(
    attachment: ICustomAttachment,
    index: number
  ) {
    const { attachmentId } = attachment;
    this.isDownloading[attachmentId] = true;
    try {
      await this.db.downloadAttachment(
        "sessions",
        this.session._id,
        attachmentId
      );
      this.isDownloading[attachmentId] = false;
      this.attachments[index].isDownloaded = true;
    } catch (error) {
      this.isDownloading[attachmentId] = false;
      // TODO - notifiy error message
    }
  }
  private async _prepareAttachments(session: ISessionMeta & IDBDoc) {
    const attachments = session.attachments || {};
    const downloads = session._attachments || {};
    this.attachments = Object.entries(attachments).map(
      ([attachmentId, meta]) => ({
        docId: session._id,
        attachmentId,
        isDownloaded: downloads[attachmentId] ? true : false,
        ...meta,
      })
    );
  }
}
