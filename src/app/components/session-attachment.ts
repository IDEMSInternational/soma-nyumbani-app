import { Component, Input, OnInit } from "@angular/core";
import { DbService } from "src/app/services/db.service";
import { FileService } from "src/app/services/file.service";
import {
  ICustomAttachment,
  IDBAttachmentStub,
  IDBDoc,
  ISessionMeta,
} from "src/types";

@Component({
  selector: "app-session-attachment",
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  template: `
    <div (click)="handleAttachmentClick()">
      <div style="font-weight:bold">
        {{ _attachment.attachmentId }}
      </div>
      <div style="display:flex; align-items:center; cursor:pointer">
        <div style="flex:1">
          <div style="font-size:small">
            <div>{{ _attachment.content_type }}</div>
            <div>{{ _attachment.length | fileSize }}</div>
          </div>
        </div>
        <ion-button
          fill="clear"
          [color]="_attachment.isDownloaded ? 'secondary' : 'primary'"
          style="height:3em"
        >
          <span *ngIf="!isDownloading">{{
            _attachment.isDownloaded ? "Open" : "Download"
          }}</span>
          <ion-icon
            [name]="_attachment.isDownloaded ? 'open-outline' : 'download'"
            *ngIf="!isDownloading"
            style="font-size:2em;"
            slot="end"
          ></ion-icon>
          <span *ngIf="isDownloading">Downloading...</span>
          <ion-spinner
            name="crescent"
            *ngIf="isDownloading"
            style="font-size:2em;"
            slot="end"
          ></ion-spinner>
        </ion-button>
      </div>
    </div>
  `,
})
export class SessionAttachmentComponent implements OnInit {
  isDownloading = false;
  _attachment: ICustomAttachment;
  @Input() attachment: IAttachmentInput;
  @Input() session: ISessionMeta & IDBDoc;
  constructor(public fileService: FileService, public db: DbService) {}

  ngOnInit() {
    this._prepareAttachments(this.session, this.attachment);
  }

  handleAttachmentClick() {
    if (this.isDownloading) {
      return;
    }
    if (this._attachment.isDownloaded) {
      this.fileService.openAttachment(this._attachment);
    } else {
      this.downloadAttachment(this._attachment);
    }
  }

  private async downloadAttachment(attachment: ICustomAttachment) {
    const { attachmentId } = attachment;
    this.isDownloading = true;
    try {
      await this.db.downloadAttachment(
        "sessions",
        this.session._id,
        attachmentId
      );
      this.isDownloading[attachmentId] = false;
      this._attachment.isDownloaded = true;
    } catch (error) {
      this.isDownloading[attachmentId] = false;
      // TODO - notifiy error message
    }
  }
  private async _prepareAttachments(
    session: ISessionMeta & IDBDoc,
    attachment: IAttachmentInput
  ) {
    console.log("prepare attachment", session, attachment);
    const { attachmentId } = attachment;
    const downloads = session._attachments || {};
    // TODO - check isdownloaded
    this._attachment = {
      ...attachment,
      docId: session._id,
      isDownloaded: downloads[attachmentId] ? true : false,
    };
    console.log("attachment", this._attachment);
  }
}
/**
 * When passing an attachment to the component it should also retain the
 * key of the attachment as 'attachmentId'
 */
interface IAttachmentInput extends IDBAttachmentStub {
  attachmentId: string;
}
