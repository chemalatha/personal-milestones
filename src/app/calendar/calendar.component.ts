import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {

  constructor(private calendarService: CalendarService) { }

  public daysAndWeeks$: Observable<string[] | string[][]>;

  public currentDisplayDate$ = this.calendarService.currentDisplayDate$;
  public nextMonthDisabled$ = this.calendarService.nextMonthDisabled$;
  public showWeekView$ = this.calendarService.showWeekView$;

  ngOnInit(): void {
    this.daysAndWeeks$ = this.calendarService.getDaysAndWeeksSequence();
  }

  onWeekViewToggle() {
    this.calendarService.toggleWeekView();
  }

  goToPrevious() {
    this.calendarService.goToPrevious();
  }

  goToNext() {
    this.calendarService.goToNext();
  }

}
