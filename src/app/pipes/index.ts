import { NgModule } from "@angular/core";
import { FileSizePipe } from "./fileSize.pipe";
import { ObjectToArrayPipe } from "./objectToArray.pipe";

const Pipes = [FileSizePipe, ObjectToArrayPipe];

@NgModule({
  imports: [],
  exports: Pipes,
  declarations: Pipes,
  providers: [],
})
export class AppPipesModule {}
