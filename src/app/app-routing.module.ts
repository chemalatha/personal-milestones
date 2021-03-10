import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './auth/signin/signin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/signin' },
  { path: 'signin', component: SigninComponent },
  // { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule), canLoad: [AuthGuardService] },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule), canLoad: [AuthGuardService] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
