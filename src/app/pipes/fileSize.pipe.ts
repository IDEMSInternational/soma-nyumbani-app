import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileSize",
})
export class FileSizePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const size = Number(value);
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const unit = ["B", "kB", "MB", "GB", "TB"][i];
    return `
      ${(size / Math.pow(1024, i)).toFixed(0)} ${unit}
    `;
  }
}
