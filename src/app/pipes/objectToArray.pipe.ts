import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "objectToArray",
})

/**
 * Convert a json object to an array for use in ngFor
 * @param keyAs - optional rename variable to save the key as within resulting array object
 * E.g.
 * ```
 * {some-file.pdf:{content-type:'pdf'}} | objectToArray:'filename'}
 * [{content-type:'pdf', filename: 'some-file.pdf'}]
 * ```
 */
export class ObjectToArrayPipe implements PipeTransform {
  transform(obj: { [key: string]: any }, keyAs: string = "key"): any {
    console.log("object to array", obj, keyAs);
    return obj
      ? Object.entries(obj).map(([key, value]) => ({ ...value, [keyAs]: key }))
      : obj;
  }
}
