import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './../auth/auth-guard.service';

import { CalendarComponent } from './calendar.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';

const calendarRoutes: Routes = [
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardService] },
  { path: 'calendar/edit/:day', component: CalendarEditComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [
    RouterModule.forChild(calendarRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CalendarRoutingModule {}
