import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DownloadsPageRoutingModule } from "./downloads-routing.module";

import { DownloadsPage } from "./downloads.page";
import { AppPipesModule } from "src/app/pipes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadsPageRoutingModule,
    AppPipesModule,
  ],
  declarations: [DownloadsPage],
})
export class DownloadsPageModule {}
