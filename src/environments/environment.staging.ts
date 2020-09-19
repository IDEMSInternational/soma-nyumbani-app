import { version } from "../../package.json";
import FIREBASE_CONFIG from "./firebaseConfig";

export const environment = {
  production: true,
  staging: false,
  APP_VERSION: version,
  FIREBASE_CONFIG,
};
