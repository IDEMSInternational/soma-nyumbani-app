import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SessionPageRoutingModule } from "./session-routing.module";

import { SessionPage } from "./session.page";
import { SessionAttachmentsComponent } from "./components/session-attachments";
import { AppPipesModule } from "src/app/pipes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionPageRoutingModule,
    AppPipesModule,
  ],
  declarations: [SessionPage, SessionAttachmentsComponent],
})
export class SessionPageModule {}
