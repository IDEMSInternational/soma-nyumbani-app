import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "day/1",
    pathMatch: "full",
  },
  {
    path: "day/:dayId",
    loadChildren: () =>
      import("./pages/day/day.module").then((m) => m.DayPageModule),
  },
  {
    path: "day/:dayId/session/:sessionId",
    loadChildren: () =>
      import("./pages/session/session.module").then((m) => m.SessionPageModule),
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
    path: "search",
    loadChildren: () =>
      import("./pages/search/search.module").then((m) => m.SearchPageModule),
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
  // If page doesn't exist just redirect
  { path: "**", redirectTo: "day/1" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
