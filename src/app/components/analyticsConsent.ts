import { Component } from "@angular/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-analytics-consent",
  template: `
    <div class="ion-padding">
      <h2>Terms and Privacy</h2>
      <p>
        By proceeding you agree to our
        <a routerLink="/terms" (click)="popover.dismiss()" mat-dialog-close
          >App Terms</a
        >
        and
        <a routerLink="/privacy" (click)="popover.dismiss()" mat-dialog-close
          >Privacy Policy</a
        >.
      </p>
      <!-- currently only used for ci -->
      <ion-button
        cdkFocusInitial
        aria-label="privacy-consent-false"
        style="opacity:0; cursor:auto"
        (click)="popover.dismiss(false)"
      >
        Do not agree
      </ion-button>

      <ion-button
        color="primary"
        cdkFocusInitial
        aria-label="privacy-consent-true"
        (click)="popover.dismiss(true)"
      >
        OK
      </ion-button>
    </div>
  `,
  styles: [
    `
      h2 {
        text-align: center;
      }
    `,
  ],
})
export class AnalyticsConsentComponent {
  constructor(public popover: PopoverController) {}
}
