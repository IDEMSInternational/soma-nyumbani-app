import { Component, ViewChild } from "@angular/core";
import { IonSlides, ModalController } from "@ionic/angular";
import { IUser } from "src/types";
import { PrivacyPage } from "../pages/privacy/privacy.page";
import { TermsPage } from "../pages/terms/terms.page";

import { UserService } from "../services/user.service";

@Component({
  selector: "app-intro-tutorial",
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
      ion-slides {
        height: 100%;
      }
      ion-content {
        --background: white;
      }

      .swiper-slide {
        display: block;
      }

      .swiper-slide h2 {
        margin-top: 2.8rem;
      }
      ion-button {
        margin: 5px 40px;
        height: 4em;
      }

      .swiper-slide img {
        height: 33vh;
        max-height: 180px;
        pointer-events: none;
        margin: 2em 0;
      }

      b {
        font-weight: 500;
      }
      .link {
        text-decoration: underline;
        color: var(--ion-color-primary);
        cursor: pointer;
      }

      p {
        padding: 0 40px;
        font-size: 14px;
        line-height: 1.5;
        color: var(--ion-color-step-600, #60646b);
        min-height: 5em;
      }

      p b {
        color: var(--ion-text-color, #000000);
      }
    `,
  ],
  template: `<ion-content fullscreen class="ion-padding" scroll-y="false">
    <ion-slides #slides>
      <!-- User Role Slide -->
      <ion-slide>
        <div class="slide">
          <img src="assets/images/welcome.svg" />
          <p>
            Welcome to the Soma Nyumbani app <br /><br />
            What is your current role?
          </p>
          <ion-button
            expand="block"
            fill="outline"
            (click)="setRole('teacher')"
          >
            Teacher
          </ion-button>
          <ion-button
            expand="block"
            fill="outline"
            (click)="setRole('facilitator')"
          >
            Facilitator
          </ion-button>
          <!-- OMIT student options (for now) as requires more
          clarification internally and for play store for how data will
          be safeguarded for younger users -->
        </div>
      </ion-slide>
      <!-- Sync Slide -->
      <ion-slide *ngIf="!userService.user.uid">
        <div class="slide">
          <img src="assets/images/sync.svg" style="padding:20px" />
          <p>Sign in to automatically backup and restore your data</p>
          <ion-button
            color="secondary"
            aria-label="privacy-consent-true"
            expand="block"
            fill="solid"
            (click)="signIn()"
          >
            Sign in with Google
          </ion-button>
          <ion-button
            color="dark"
            aria-label="privacy-consent-true"
            expand="block"
            fill="clear"
            (click)="slides.slideNext()"
          >
            Skip for now
          </ion-button>
        </div>
      </ion-slide>
      <!-- Privacy Consent Slide -->
      <ion-slide>
        <div class="slide">
          <img src="assets/images/privacy-policy.svg" />
          <p>
            By proceeding you agree to our
            <span class="link" (click)="showTerms()">App Terms</span>
            <span> and </span>
            <span class="link" (click)="showPrivacyPolicy()"
              >Privacy Policy</span
            >.
          </p>
          <ion-button
            button
            (click)="setPrivacyConsent(true)"
            aria-label="privacy-consent-true"
          >
            OK, let's go!
          </ion-button>
        </div>
      </ion-slide>
    </ion-slides>
  </ion-content>`,
})
export class IntroTutorialComponent {
  @ViewChild("slides", { static: true }) slides: IonSlides;
  constructor(
    public userService: UserService,
    private modalCtrl: ModalController
  ) {}

  setRole(role: IUser["role"]) {
    this.userService.updateUser({ role }, false);
    this.slides.slideNext();
  }
  setPrivacyConsent(analyticsConsent: boolean) {
    this.userService.updateUser({ analyticsConsent, tutorialComplete: true });
  }
  signIn() {
    this.userService.signIn();
  }
  async showTerms() {
    const modal = await this.modalCtrl.create({
      component: TermsPage,
      componentProps: { isModal: true },
    });
    await modal.present();
  }
  async showPrivacyPolicy() {
    const modal = await this.modalCtrl.create({
      component: PrivacyPage,
      componentProps: { isModal: true },
    });
    await modal.present();
  }

  private async showConsentDialog() {
    // const popover = await this.popover.create({
    //   component: AnalyticsConsentComponent,
    //   backdropDismiss: false,
    // });
    // await popover.present();
    // const consented: boolean = (await popover.onDidDismiss()).data;
    // return consented;
  }
}
