import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-sessions-list-modal",
  template: `<app-sessions-list
    (selectedSessionChange)="dismiss($event)"
  ></app-sessions-list>`,
})

/**
 * A simple popup to display the sessions list component
 */
export class SessionsListModalComponent {
  constructor(private modalCtrl: ModalController) {}

  dismiss(selectedSession: string) {
    this.modalCtrl.dismiss(selectedSession);
  }
}
