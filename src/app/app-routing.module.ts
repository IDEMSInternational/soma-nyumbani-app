import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "report",
    loadChildren: () =>
      import("./pages/report/report.module").then((m) => m.ReportPageModule),
  },

  {
    path: "about",
    loadChildren: () =>
      import("./pages/about/about.module").then((m) => m.AboutPageModule),
  },
  {
    path: "downloads",
    loadChildren: () =>
      import("./pages/downloads/downloads.module").then(
        (m) => m.DownloadsPageModule
      ),
  },

  {
    path: "terms",
    loadChildren: () =>
      import("./pages/terms/terms.module").then((m) => m.TermsPageModule),
  },
  {
    path: "contact",
    loadChildren: () =>
      import("./pages/contact/contact.module").then((m) => m.ContactPageModule),
  },
  {
    path: "privacy",
    loadChildren: () =>
      import("./pages/privacy/privacy.module").then((m) => m.PrivacyPageModule),
  },

  // If page doesn't exist just redirect - disabled during development
  // { path: "**", redirectTo: "/" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
