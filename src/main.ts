import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import * as Sentry from "@sentry/angular";

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn:
      "https://aff2d18bacf54fac954bb73cc5b06f0a@o157757.ingest.sentry.io/5436496",
  });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
