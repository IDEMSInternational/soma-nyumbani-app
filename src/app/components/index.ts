import { NgModule } from "@angular/core";

import { SessionActivityComponent } from "./session-activity";
import { CommonModule } from "@angular/common";

const AppComponents = [SessionActivityComponent];

@NgModule({
  imports: [CommonModule],
  exports: AppComponents,
  declarations: AppComponents,
  providers: [],
})
export class AppComponentsModule {}
