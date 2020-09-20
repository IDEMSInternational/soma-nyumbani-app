import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-pdf-viewer-modal",
  template: `
    <ion-fab
      vertical="top"
      horizontal="end"
      slot="fixed"
      (click)="modalCtrl.dismiss()"
    >
      <ion-fab-button color="light">
        <ion-icon name="close"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-content>
      <ng2-pdfjs-viewer [pdfSrc]="pdfSrc"></ng2-pdfjs-viewer>
    </ion-content>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button color="secondary">
        <ion-icon name="clipboard-outline"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button
          ><ion-icon name="document-text-outline"></ion-icon
        ></ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  `,
})
/**
 * Simple modal to render pdf content via pdf.js. See angular implementation here for
 * customisation: https://www.npmjs.com/package/ng2-pdfjs-viewer
 */
export class PdfViewerModalComponent implements OnInit {
  title: string;
  pdfSrc: string | Blob | Uint8Array;
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {}
}
