import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { IntroTutorialComponent } from "./introTutorial";

const AppComponents = [IntroTutorialComponent];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule],
  exports: AppComponents,
  declarations: AppComponents,
  providers: [],
})
export class AppComponentsModule {}
