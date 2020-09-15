import { NgModule } from "@angular/core";
import { FileSizePipe } from "./fileSize.pipe";

const Pipes = [FileSizePipe];

@NgModule({
  imports: [],
  exports: Pipes,
  declarations: Pipes,
  providers: [],
})
export class AppPipesModule {}
