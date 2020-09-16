import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DbService } from "src/app/services/db.service";
import { ICustomAttachment, IDBDoc, ISessionMeta } from "src/types";

@Component({
  selector: "app-downloads",
  templateUrl: "./downloads.page.html",
  styleUrls: ["./downloads.page.scss"],
})
export class DownloadsPage implements OnInit, OnDestroy {
  subscription$: Subscription;
  attachments: IAttachmentDL[] = [];
  constructor(private db: DbService) {}

  /**
   * Get the list of all downloaded session attachments
   */
  ngOnInit() {
    this.subscription$ = this.db.sessions$.subscribe((sessions) => {
      const downloads = [];
      for (const session of sessions) {
        if (session._attachments) {
          Object.entries(session._attachments).forEach(
            ([attachmentId, value]) => {
              downloads.push({ attachmentId, session, ...value });
            }
          );
        }
      }
      this.attachments = downloads;
    });
  }
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
  async removeAttachment(attachment: IAttachmentDL) {
    const { attachmentId, session } = attachment;
    const { _rev, _id } = session;
    await this.db.removeAttachment("sessions", _id, attachmentId, _rev);
  }
}

interface IAttachmentDL extends ICustomAttachment {
  session: ISessionMeta & IDBDoc;
}
