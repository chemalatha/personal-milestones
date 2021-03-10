import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Milestone } from './../../shared/model/milestone.interface';

import { CalendarService } from './../calendar.service';
import { ErrorHandler } from '../../shared/module/error-handler';

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarEditComponent extends ErrorHandler implements OnInit, OnDestroy {

  public day: number;
  private month: number;
  private year: number;
  public milestones$: Observable<Milestone[]>;
  public getCurrentDisplayDayDate$: Observable<string>;
  public errorMessage$: Observable<string>;
  public formFactor$: Observable<string>;

  public min = 1;
  public max: number;

  private monthSubscription: Subscription;
  private yearSubscription: Subscription;

  constructor(private calendarService: CalendarService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.monthSubscription = this.calendarService.getStateMonth().subscribe({
      next: (month: number) => this.month = month
    });
    this.yearSubscription = this.calendarService.getStateYear().subscribe({
      next: (year: number) => this.year = year
    });
    this.route.params.subscribe({
      next: (param: Params) => {
        this.day = +param.day;
        this.calendarService.changeEditDay(this.day);
        this.calendarService.getMilestonesAction(`${this.month}-${this.day}-${this.year}`);
      }
    });
    this.formFactor$ = this.calendarService.formFactor$;
    this.errorMessage$ = this.calendarService.errorMessage$;
    this.getCurrentDisplayDayDate$ = this.calendarService.getCurrentDisplayDayDate$;
    this.milestones$ = this.calendarService.getStateMilestones();
    this.max = this.getMax(this.year, this.month);
  }

  ngOnDestroy(): void {
    if (!!this.monthSubscription) {
      this.monthSubscription.unsubscribe();
    }
    if (!!this.yearSubscription) {
      this.yearSubscription.unsubscribe();
    }
  }

  goToPreviousDay(): void {
    const newDay = this.day - 1;
    if (newDay >= this.min) {
      this.calendarService.viewEntries(newDay);
    }
  }

  goToNextDay(): void {
    const newDay = this.day + 1;
    if (newDay <= this.max) {
      this.calendarService.viewEntries(newDay);
    }
  }

  dismissError(): void {
    this.calendarService.dismissError();
  }

  onAddMilestone(): void {
    this.calendarService.addAction(this.day, this.month, this.year);
  }

  onEditMilestone(milestone: Milestone): void {
    this.calendarService.editAction(this.day, this.month, this.year, milestone);
  }

  onDeleteMilestone(milestoneid: number): void {
    this.calendarService.deleteAction(milestoneid);
  }

  onViewMilestone(description: string): void {
    this.calendarService.viewAction(description);
  }

  private getMax(year: number, month: number): number {
    const currentDate = new Date();
    if (month === (currentDate.getMonth() + 1)) {
      return currentDate.getDate();
    }
    return this.calendarService.getLastDayOfMonth(year, month);
  }

}
