import { version } from "../../package.json";
import FIREBASE_CONFIG from "./firebaseConfig";

export const environment = {
  production: true,
  staging: true,
  APP_VERSION: version,
  FIREBASE_CONFIG,
};
