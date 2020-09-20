import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { PdfViewerModalComponent } from "src/app/components/pdf-viewer-modal";
import { SessionAttachmentComponent } from "src/app/components/session-attachment";
import { SessionsListModalComponent } from "src/app/components/sessions-list-modal";
import { DbService } from "src/app/services/db.service";
import { FileService } from "src/app/services/file.service";
import { UserService } from "src/app/services/user.service";
import { DEFAULT_REPORT, ISessionReport } from "src/models";

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"],
})
/**
 * Presents key information for user to generate a new session report, and start a session
 * TODO - inputs might be better formatted within a form with general change bindings
 */
export class ReportPage implements AfterViewInit {
  // Provide a dynamic binding for session attachment components so that the download
  // status can be confirmed before proceeding to a session
  @ViewChildren("attachment") attachments: QueryList<
    SessionAttachmentComponent
  >;
  report: ISessionReport = DEFAULT_REPORT;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public db: DbService,
    private modalCtrl: ModalController,
    private user: UserService,
    private fileService: FileService
  ) {
    const { reportId } = route.snapshot.queryParams;
    if (reportId) {
      console.log("report id found, loading report", reportId);
      // TODO
    }
    if (!reportId) {
      console.log("no report id, creating");
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { reportId: this.report._id },
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    }
    //
  }
  ngAfterViewInit() {
    // TODO - use value to confirm if all attachments downloaded, and add option to button
    // TODO - add similar logic to display simple master download button in sessions main list
    this.attachments.changes.subscribe((c) => {
      console.log("attachments", c);
    });
  }

  updateReport(key: keyof ISessionReport, value: any) {
    console.log("update report", key, value);
    this.report[key as any] = value;
    const { _id } = this.report;
    this.user.updateUserDoc("sessionReports", _id, this.report, false);
  }

  async openSessionSelect() {
    console.log("opening session select");
    const modal = await this.modalCtrl.create({
      component: SessionsListModalComponent,
      componentProps: { selectedSession: this.report.selectedSession },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.updateReport("selectedSession", data);
  }
  async goToSession(attachment) {
    console.log("attachment", attachment);
    console.log("attachments", this.attachments);
    this.attachments.forEach((a) => {
      console.log("a", a, a.isDownloaded);
    });
    // assume if opening criteria met to no longer count as draft
    // this.updateReport("_draft", false);
    // this.fileService.openAttachment();
  }
}
