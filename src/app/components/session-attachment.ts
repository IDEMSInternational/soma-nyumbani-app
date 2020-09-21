import { Component, Input, OnInit } from "@angular/core";
import { DbService } from "src/app/services/db.service";
import { FileService } from "src/app/services/file.service";
import {
  ICustomAttachment,
  IDBAttachmentStub,
  IDBDoc,
  ISessionMeta,
} from "src/models";

@Component({
  selector: "app-session-attachment",
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .attachment-title {
        font-size: small;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .attachment-meta {
        font-size: small;
      }
    `,
  ],
  template: `
    <div (click)="handleAttachmentClick()">
      <!-- NOTE - note required currently -->
      <!-- <div class="attachment-title">
        {{ _attachment.attachmentId }}
      </div> -->
      <div style="display:flex; align-items:center; cursor:pointer">
        <div style="flex:1">
          <div class="attachment-meta">
            <div>{{ _attachment.content_type }}</div>
            <div>{{ _attachment.length | fileSize }}</div>
          </div>
        </div>
        <ion-button
          fill="clear"
          [color]="isDownloaded ? 'secondary' : 'primary'"
          style="height:3em"
        >
          <span *ngIf="!isDownloading">{{
            isDownloaded ? "Open" : "Download"
          }}</span>
          <ion-icon
            [name]="isDownloaded ? 'open-outline' : 'download'"
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
  isDownloaded = false;
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
    if (this.isDownloaded) {
      this.fileService.openAttachment(this._attachment);
    } else {
      this.downloadAttachment();
    }
  }

  public async downloadAttachment() {
    const { attachmentId } = this._attachment;
    this.isDownloading = true;
    try {
      await this.db.downloadAttachment(
        "sessions",
        this.session._id,
        attachmentId
      );
      this.isDownloading = false;
      this.isDownloaded = true;
    } catch (error) {
      this.isDownloading = false;
      // TODO - notifiy error message
    }
  }
  private async _prepareAttachments(
    session: ISessionMeta & IDBDoc,
    attachment: IAttachmentInput
  ) {
    const { attachmentId } = attachment;
    const downloads = session._attachments || {};
    console.log("downloads", downloads);
    this._attachment = {
      ...attachment,
      docId: session._id,
    };
    this.isDownloaded = downloads[attachmentId] ? true : false;
  }
}
/**
 * When passing an attachment to the component it should also retain the
 * key of the attachment as 'attachmentId'
 */
interface IAttachmentInput extends IDBAttachmentStub {
  attachmentId: string;
}
