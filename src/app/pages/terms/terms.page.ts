import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.page.html",
  styleUrls: ["./terms.page.scss"],
})
export class TermsPage {
  // can be shown as a popup-style modal from other places
  @Input() isModal: boolean;
  constructor(public modalCtrl: ModalController) {}
}
