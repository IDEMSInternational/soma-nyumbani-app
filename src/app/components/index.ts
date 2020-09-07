import { NgModule } from "@angular/core";

import { SessionActivityComponent } from "./session-activity";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

const AppComponents = [SessionActivityComponent];

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: AppComponents,
  declarations: AppComponents,
  providers: [],
})
export class AppComponentsModule {}
