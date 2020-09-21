import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { SessionAttachmentComponent } from "src/app/components/session-attachment";
import { SessionsListModalComponent } from "src/app/components/sessions-list-modal";
import { DbService } from "src/app/services/db.service";
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
export class ReportPage implements AfterViewInit, OnDestroy {
  // Provide a dynamic binding for session attachment components so that the download
  // status can be confirmed before proceeding to a session
  @ViewChildren("attachment") attachments: QueryList<
    SessionAttachmentComponent
  >;
  sessionGuideStatus: "downloaded" | "downloading";
  report: ISessionReport;
  attachments$: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public db: DbService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.init();
  }
  /**
   * During initialisation identify the day and session number the report refers to using
   * route query params, load any existing report that exists, otherwise create with
   * default template
   */
  private init() {
    const {
      session_number,
      day_number,
      selectedSession,
    } = this.route.snapshot.queryParams;
    if (session_number && day_number && selectedSession) {
      const _id = `day-${day_number}_session-${session_number}`;
      if (this.userService.user.sessionReports[_id]) {
        this.report = this.userService.user.sessionReports[_id];
        console.log("loading existing report", this.report);
      } else {
        console.log("creating new report");
        this.report = {
          ...DEFAULT_REPORT,
          _id,
          selectedSession,
          day_number,
          session_number,
        };
      }
    } else {
      // no session selected, return to home page
      this.router.navigate(["/"]);
    }
  }
  ngAfterViewInit() {
    this._updateAttachmentDownloadStatus();
    this._subscribeToAttachmentChanges();
  }
  /**
   * The report doesn't natively know if attachments have been downloaded, so observe for
   * changes to child session-attachment components to inform
   */
  private _subscribeToAttachmentChanges() {
    this.attachments$ = this.attachments.changes.subscribe(() =>
      this._updateAttachmentDownloadStatus()
    );
  }
  /**
   * Simple check if session-attachment components exist, and if the first component has
   * been marked as downloaded
   */
  private _updateAttachmentDownloadStatus() {
    const { first } = this.attachments;
    if (first && first.isDownloaded) {
      this.sessionGuideStatus = "downloaded";
      this.cdr.detectChanges();
    }
  }
  ngOnDestroy() {
    this.attachments$.unsubscribe();
  }

  updateReport(key: keyof ISessionReport, value: any) {
    console.log("update report", key, value);
    this.report[key as any] = value;
    const { _id } = this.report;
    this.userService.updateUserDoc("sessionReports", _id, this.report, false);
  }

  async openSessionSelect() {
    const modal = await this.modalCtrl.create({
      component: SessionsListModalComponent,
      componentProps: { selectedSession: this.report.selectedSession },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.updateReport("selectedSession", data);
  }
  /**
   * Again, the report doesn't have native functionality to open the session guide pdf
   * so call on first session-attachment component (assuming it is the guide)
   * and default open method
   */
  async goToSession() {
    // assume the report is now not draft, so save
    this.updateReport("_draft", false);
    this.attachments.first.handleAttachmentClick();
  }
  async downloadSessionGuide() {
    this.sessionGuideStatus = "downloading";
    await this.attachments.first.downloadAttachment();
    this.sessionGuideStatus = "downloaded";
    this.cdr.detectChanges();
  }
}
