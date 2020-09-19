import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { SessionsListModalComponent } from "src/app/components/sessions-list-modal";
import { DbService } from "src/app/services/db.service";

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"],
})
export class ReportPage implements OnInit {
  report: ISessionReport = {};
  constructor(
    route: ActivatedRoute,
    private router: Router,
    public db: DbService,
    private modalCtrl: ModalController
  ) {
    const reportId = route.snapshot.params.reportId;
    if (reportId) {
      const report = "todo - get report by id, redirect if not found";
    }
  }
  ngOnInit() {}

  async openSessionSelect() {
    console.log("opening session select");
    const modal = await this.modalCtrl.create({
      component: SessionsListModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.report.selectedSession = data;
  }
}

// TODO - allow multiple session guides for a single report?... maybe no (harder searching/indexing, easier to add more layers later)
interface ISessionReport {
  selectedSession?: string;
}
