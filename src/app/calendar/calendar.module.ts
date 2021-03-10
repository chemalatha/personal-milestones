import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from './../shared/module/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';

import { CalendarService } from './calendar.service';

import { CalendarComponent } from './calendar.component';
import { CalendarItemComponent } from './calendar-item/calendar-item.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { CalendarEditItemComponent } from './calendar-edit-item/calendar-edit-item.component';

import * as fromCalendarReducer from './state/calendar.reducer';
import { CalendarEffects } from './state/calendar.effect';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarItemComponent,
    CalendarEditComponent,
    CalendarEditItemComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    StoreModule.forFeature('calendar', fromCalendarReducer.calendarReducer),
    EffectsModule.forFeature([ CalendarEffects ])
  ],
  providers: [CalendarService]
})
export class CalendarModule {}
