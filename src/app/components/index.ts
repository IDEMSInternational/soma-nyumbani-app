import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { IntroTutorialComponent } from "./introTutorial";
import { SessionAttachmentComponent } from "./session-attachment";
import { SessionsListComponent } from "./sessions-list";
import { SessionsListModalComponent } from "./sessions-list-modal";
import { AppPipesModule } from "../pipes";
import { PdfViewerModalComponent } from "./pdf-viewer-modal";

const AppComponents = [
  IntroTutorialComponent,
  SessionAttachmentComponent,
  SessionsListComponent,
  SessionsListModalComponent,
  PdfViewerModalComponent,
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    AppPipesModule,
    PdfJsViewerModule,
  ],
  exports: AppComponents,
  declarations: AppComponents,
  providers: [],
})
export class AppComponentsModule {}
