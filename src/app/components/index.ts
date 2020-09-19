import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { IntroTutorialComponent } from "./introTutorial";
import { SessionAttachmentComponent } from "./session-attachment";
import { SessionsListComponent } from "./sessions-list";
import { SessionsListModalComponent } from "./sessions-list-modal";
import { AppPipesModule } from "../pipes";

const AppComponents = [
  IntroTutorialComponent,
  SessionAttachmentComponent,
  SessionsListComponent,
  SessionsListModalComponent,
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, AppPipesModule],
  exports: AppComponents,
  declarations: AppComponents,
  providers: [],
})
export class AppComponentsModule {}
