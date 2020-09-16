import { Injectable } from "@angular/core";
import { Plugins, FilesystemDirectory, Capacitor } from "@capacitor/core";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ICustomAttachment } from "src/types";
import { AnalyticsService } from "./analytics.service";
import { DbService } from "./db.service";

const { Filesystem } = Plugins;

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(
    private db: DbService,
    private fileOpener: FileOpener,
    private analytics: AnalyticsService
  ) {}

  /**
   * Given an attachment stub, retrieve the full doc and open using native file opener on
   * device, or in browser on web
   */
  async openAttachment(attachment: ICustomAttachment) {
    const { attachmentId, docId, content_type } = attachment;
    // log to analytics
    this.analytics.logEvent("open_attachment", { attachmentId });
    // Get Attachment
    const data = await this.db.getAttachment("sessions", docId, attachmentId);
    const file = new Blob([data], { type: content_type });
    const fileURL = URL.createObjectURL(file);
    // Open - Native
    // Write data to temp file and open from there
    // TODO - possibly check if already exists (and matching md5) and just open
    if (Capacitor.isNative) {
      const reader = new FileReader();
      const directory = FilesystemDirectory.External;
      // Set prefix for external storage with attachmentId as filename
      const path = `international.idems.somanyumbani/attachments/${docId}/${attachmentId}`;
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const { uri } = await Filesystem.writeFile({
          data: base64data,
          path,
          directory,
          recursive: true,
        });
        try {
          // NOTE - outdated support for AndroidX in fileopener requires
          // use of jetifier in postinstall: https://github.com/pwlin/cordova-plugin-file-opener2/issues/256
          this.fileOpener.open(uri, content_type).catch((err) => {
            console.error(err);
          });
        } catch (error) {
          console.error(error);
          // workaround for inaccessible file urls
          // https://github.com/Smile-SA/cordova-plugin-fileopener/issues/15
          // https://github.com/pwlin/cordova-plugin-file-opener2/issues/125
          // https://github.com/ionic-team/capacitor/issues/1040
          // const entry = await this.file.resolveLocalFilesystemUrl(uri);
          // console.log("entry", entry);
          // this.fileOpener.open(entry.toURL(), content_type).catch((err) => {
          //   console.error(err);
          // });
        }
      };
      // Open - Web
    } else {
      window.open(fileURL);
    }
  }
}
