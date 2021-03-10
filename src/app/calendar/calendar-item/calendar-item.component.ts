import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { CalendarService } from './../calendar.service';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarItemComponent implements OnInit {

  @Input() displayDate: string;
  public dateTooltip$: Observable<Date>;
  public label$: Observable<string>;

  private dayOfMonth: number;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.dateTooltip$ = this.calendarService.getDisplayDate(this.displayDate);
    this.dayOfMonth = +this.calendarService.extractNumbers(this.displayDate);
    this.label$ = this.calendarService.getLabelDate(this.dayOfMonth);
  }

  viewEntries() {
    this.calendarService.viewEntries(this.dayOfMonth);
  }

}
