import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DayPageRoutingModule } from "./day-routing.module";

import { DayPage } from "./day.page";
import { AppComponentsModule } from "../../components";
import { SessionSummaryCardComponent } from "./components/session-summary-card";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DayPageRoutingModule,
    AppComponentsModule,
  ],
  declarations: [DayPage, SessionSummaryCardComponent],
})
export class DayPageModule {}
