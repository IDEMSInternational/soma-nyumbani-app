import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-sessions-list-modal",
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss(this.selectedSession)"
            ><ion-icon slot="icon-only" name="close"></ion-icon
          ></ion-button>
        </ion-buttons>
        <ion-title>Sessions</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-sessions-list
        [selectedSession]="selectedSession"
        (selectedSessionChange)="this.selectedSession = $event"
      ></app-sessions-list
    ></ion-content>
  `,
})

/**
 * A simple popup to display the sessions list component
 */
export class SessionsListModalComponent {
  selectedSession: string;
  constructor(public modalCtrl: ModalController) {}

  dismiss(selectedSession: string) {
    this.modalCtrl.dismiss(selectedSession);
  }
}
