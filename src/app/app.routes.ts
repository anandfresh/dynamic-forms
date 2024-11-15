import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';

export const appRoutes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadComponent: () =>
  //     import('./pages/page-home/page-home.component').then(
  //       (c) => c.PageHomeComponent
  //     ),
  // },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/page-playground/page-playground.component').then(
        (c) => c.PagePlaygroundComponent
      ),
  },
  {
    matcher: (segments: UrlSegment[]): UrlMatchResult | null => {
      const invalidRoute = !segments.length || segments[0].path !== 'docs';
      return invalidRoute ? null : { consumed: segments };
    },
    loadComponent: () =>
      import('./pages/page-docs/page-docs.component').then(
        (c) => c.PageDocsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
