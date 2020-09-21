import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReportPageRoutingModule } from "./report-routing.module";

import { ReportPage } from "./report.page";
import { AppComponentsModule } from "src/app/components";
import { AppPipesModule } from "src/app/pipes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    AppComponentsModule,
    AppPipesModule,
  ],
  declarations: [ReportPage],
})
export class ReportPageModule {}
