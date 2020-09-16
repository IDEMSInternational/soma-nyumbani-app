import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.page.html",
  styleUrls: ["./privacy.page.scss"],
})
export class PrivacyPage implements OnInit {
  // can be shown as a popup-style modal from other places
  @Input() isModal: boolean;
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {}
}
