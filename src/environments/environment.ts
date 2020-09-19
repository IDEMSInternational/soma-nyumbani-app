import { version } from "../../package.json";
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import FIREBASE_CONFIG from "./firebaseConfig";

export const environment = {
  production: false,
  staging: true,
  APP_VERSION: version,
  FIREBASE_CONFIG,
};
