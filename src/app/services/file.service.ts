import { Injectable } from "@angular/core";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";
import { ISessionActivity, IDBDoc, IDBAttachmentStub } from "src/types";
import { DbService } from "./db.service";

const { Filesystem } = Plugins;

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private db: DbService) {}
  async openAttachment(attachment: IAttachment) {
    console.log("open attachment", attachment);
    // get attachment
    const { attachmentId, docId, content_type } = attachment;
    const data = await this.db.getAttachment("activities", docId, attachmentId);
    console.log("data", data);
    const file = new Blob([data], { type: content_type });
    const fileURL = URL.createObjectURL(file);
    console.log("file", file);
    window.open(fileURL);
  }
}
type IAttachment = IDBAttachmentStub & {
  attachmentId: string;
  docId: string;
};
