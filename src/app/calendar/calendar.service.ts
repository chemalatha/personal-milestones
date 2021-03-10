import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestConfigService } from './../shared/service/restconfig.service';
import { DeviceService } from '../shared/service/device.service';
import { ModalService } from './../shared/service/modal.service';

import { Milestone } from '../shared/model/milestone.interface';

import * as CalendarActions from './state/calendar.action';
import * as SharedActions from './../shared/state/shared.action';
import {
  CalendarState,
  getCalendarError,
  getCurrentDate,
  getCurrentMonth,
  getCurrentMonthYear,
  getCurrentYear,
  getMilestones,
  showWeekView,
  getCurrentEditDay
} from './state/calendar.reducer';

@Injectable()
export class CalendarService {

  constructor(private store: Store<CalendarState>, private router: Router, private http: HttpClient, private rest: RestConfigService, private modal: ModalService,
              private device: DeviceService) { }

  public errorMessage$: Observable<string> = this.store.select(getCalendarError);

  public formFactor$: Observable<string> = this.device.getDeviceChangedListener();

  public currentDisplayDate$: Observable<string> = combineLatest([
    this.store.select(getCurrentDate),
    this.device.getDeviceChangedListener()
  ]).pipe(
    map(([date, size]) => {
      const dateObject: Date = new Date(date);
      return `${(size === 'xs') ? this.getShortMonths()[dateObject.getMonth()] : this.getLongMonths()[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
    })
  );

  public getCurrentDisplayDayDate$: Observable<string> = combineLatest([
    this.store.select(getCurrentEditDay),
    this.store.select(getCurrentMonth),
    this.store.select(getCurrentYear),
    this.device.getDeviceChangedListener()
  ]).pipe(
    map(([day, month, year, size]) => {
      const dateObject: Date = new Date(`${month}/${day}/${year}`);
      let dayOfWeek: string;
      let displaymonth: string;
      let displayyear: string;
      if (size === 'xs') {
        dayOfWeek = this.getShortDays()[dateObject.getDay()];
        displaymonth = this.getShortMonths()[dateObject.getMonth()];
        displayyear = `'${dateObject.getFullYear().toString().substr(2)}`;
      } else {
        dayOfWeek = this.getLongDays()[dateObject.getDay()];
        displaymonth = this.getLongMonths()[dateObject.getMonth()];
        displayyear = dateObject.getFullYear().toString();
      }
      return `${day} ${displaymonth} ${displayyear} (${dayOfWeek})`;
    })
  );

  public nextMonthDisabled$: Observable<boolean> = this.store.select(getCurrentDate).pipe(
    map((date: string) => {
      const dateObject: Date = new Date(date);
      const currentDate: Date = new Date();
      return (dateObject.getMonth() === currentDate.getMonth() && dateObject.getFullYear() === currentDate.getFullYear());
    })
  );

  public showWeekView$: Observable<boolean> = this.store.select(showWeekView);

  public nextDayDisabled(day: number): Observable<boolean> {
    return this.store.select(getCurrentDate).pipe(
      map((date: string) => {
        const dateObject: Date = new Date(date);
        const currentDate: Date = new Date();
        return (dateObject.getMonth() === currentDate.getMonth() && dateObject.getFullYear() === currentDate.getFullYear() && dateObject.getDay() === day);
      })
    );
  }

  public toggleWeekView(): void {
    this.store.dispatch(CalendarActions.toggleWeekViewAction());
  }

  public getDisplayDate(day: string): Observable<Date> {
    return combineLatest([
      this.store.select(getCurrentMonth),
      this.store.select(getCurrentYear)
    ]).pipe(
      map(([month, year]) => new Date(year, month - 1, +this.extractNumbers(day)))
    );
  }

  public getLabelDate(day: number): Observable<string> {
    return this.store.select(getCurrentMonth).pipe(
      map((month: number) => `${this.getShortMonths()[month - 1]} ${this.getQualifiedDate(day)}`)
    );
  }

  public getDaysAndWeeksSequence(): Observable<string[] | string[][]> {
    return combineLatest([
      this.nextMonthDisabled$,
      this.showWeekView$,
      this.store.select(getCurrentMonthYear)
    ]).pipe(
      map(([disabled, weekView, month]) => weekView ? this.getDaysAndWeeks(!disabled ? new Date(month) : null) : this.getDaysWithoutWeeks(!disabled ? new Date(month) : null))
    );
  }

  public getMilestonesAction(q: string) {
    this.store.dispatch(SharedActions.loadingAction({ loading: true }));
    return this.store.dispatch(CalendarActions.getEntriesAction({ q }));
  }

  public getMilestones(q: string) {
    return this.http.get<Milestone[]>(this.rest.milestones(q));
  }

  public addMilestone(milestone: Milestone) {
    return this.http.post<Milestone>(this.rest.addMilestone(), milestone);
  }

  public updateMilestone(milestoneid: number, milestone: Milestone) {
    return this.http.patch<Milestone>(this.rest.updateOrDeleteMilestone(milestoneid), milestone);
  }

  public deleteMilestone(milestoneid: number) {
    return this.http.delete<Milestone>(this.rest.updateOrDeleteMilestone(milestoneid));
  }

  public getStateMonth(): Observable<number> {
    return this.store.select(getCurrentMonth);
  }

  public getStateYear(): Observable<number> {
    return this.store.select(getCurrentYear);
  }

  public getStateMilestones(): Observable<Milestone[]> {
    return this.store.select(getMilestones);
  }

  public goToPrevious(): void {
    this.store.dispatch(CalendarActions.previousMonthAction());
  }

  public goToNext(): void {
    this.store.dispatch(CalendarActions.nextMonthAction());
  }

  public viewEntries(day: number): void {
    this.router.navigate(['calendar', 'edit', day]);
  }

  public changeEditDay(day: number): void {
    this.store.dispatch(CalendarActions.changeDayAction({ day }));
  }

  public dismissError(): void {
    this.store.dispatch(CalendarActions.clearErrorAction());
  }

  public getLongMonths(): string[] {
    return ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  }

  public getShortMonths(): string[] {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  public getLongDays(): string[] {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }

  public getShortDays(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  public deleteAction(milestoneid: number): void {
    this.modal.showConfirmDialog('Go ahead and delete this milestone entry?').subscribe({
      next: (result: { decision: boolean }) => {
        if (result.decision) {
          this.store.dispatch(SharedActions.loadingAction({ loading: true }));
          return this.store.dispatch(CalendarActions.deleteEntryAction({ milestoneid }));
        }
      }
    });
  }

  public addAction(day: number, month: number, year: number): void {
    this.modal.showAddDialog(day, month, year).subscribe({
      next: (result: { decision: boolean, data: any | null }) => {
        if (result.decision) {
          this.store.dispatch(SharedActions.loadingAction({ loading: true }));
          return this.store.dispatch(CalendarActions.addEntryAction({ day, milestone: result.data }));
        }
      }
    });
  }

  public editAction(day: number, month: number, year: number, milestone: Milestone): void {
    this.modal.showEditDialog(day, month, year, milestone).subscribe({
      next: (result: { decision: boolean, data: any | null }) => {
        if (result.decision) {
          this.store.dispatch(SharedActions.loadingAction({ loading: true }));
          return this.store.dispatch(CalendarActions.editEntryAction({ day, milestoneid: milestone.milestoneid, milestone: result.data }));
        }
      }
    });
  }

  public viewAction(description: string): void {
    this.modal.showViewDialog(description).subscribe();
  }

  private getDaysAndWeeks(dateObject?: Date): string[][] {
    let days = [];
    const weeks = [];
    const currentDate = dateObject || new Date();
    const lastDayOfMonth: number = !!dateObject ? this.getLastDayOfMonth(dateObject.getFullYear(), dateObject.getMonth() + 1) : null;
    const currentDay = !lastDayOfMonth ? currentDate.getDate() : lastDayOfMonth;
    let day = 0;
    while (currentDay > day++) {
      days.push(this.getQualifiedDate(day));
      if (day % 7 === 0) {
        weeks.push(days);
        days = [];
      } else if (day % 7 !== 0 && day === currentDay) {
        weeks.push(days);
      }
    }
    return weeks;
  }

  private getDaysWithoutWeeks(dateObject?: Date): string[] {
    const days = [];
    const currentDate = dateObject || new Date();
    const lastDayOfMonth: number = !!dateObject ? this.getLastDayOfMonth(dateObject.getFullYear(), dateObject.getMonth() + 1) : null;
    const currentDay = !lastDayOfMonth ? currentDate.getDate() : lastDayOfMonth;
    let day = 0;
    while (currentDay > day++) {
      days.push(this.getQualifiedDate(day));
    }
    return days;
  }

  public getWeeks(): string[] {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const lastDay = this.getLastDayOfMonth(year, month);
    const weeks = [];
    let currentDay = 1;
    while (currentDay <= day) {
      if ((lastDay - currentDay) <= 7) {
        weeks.push(this.getQualifiedDate(currentDay) + ' - ' + this.getQualifiedDate(lastDay));
      } else {
        weeks.push(this.getQualifiedDate(currentDay) + ' - ' + this.getQualifiedDate(currentDay + 6));
      }
      currentDay += 7;
    }
    return weeks;
  }

  public getLastDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  public getTimelines(count: number, monthType: string): string[] {
    if (count < 0) {
      return this.getWeeks();
    }
    const timelines = [];
    let counter = count;
    if (!count || count === 0) {
      return timelines;
    }
    if (!monthType) {
      monthType = 'short';
    }
    let monthNum: number = (new Date()).getMonth();
    let currentYear: number = (new Date()).getFullYear();
    const months = monthType === 'short' ? this.getShortMonths().slice() : this.getLongMonths().slice();
    while (counter > 0) {
      if (monthNum === -1) {
        monthNum = 11;
        currentYear--;
      }
      timelines.push(`${months[monthNum]}-${currentYear}`);
      counter--;
      monthNum--;
    }
    return timelines.reverse();
  }

  public getDateFromShortMonth(dateString: string): Date {
    const months: string[] = this.getShortMonths();
    const month: number = months.indexOf(dateString.split('-')[0]);
    const year: number = +(dateString.split('-')[1]);
    return new Date(year, month, 1);
  }

  public getFormattedDate(dt: Date): string {
    if (!dt) {
      return '';
    }
    return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`;
  }

  public extractNumbers(value: string): string {
    if (!value) {
      return '';
    }
    let extractedNumbers = '';
    const lengthOfString = value.length;
    for (let index = 0; index < lengthOfString; index++) {
        const characterAtIndex = value.charAt(index);
        extractedNumbers += isNaN(+characterAtIndex) ? '' : characterAtIndex;
    }
    return extractedNumbers;
  }

  private getQualifiedDate(date: string | number): string {
    let qualifiedDate: string;
    const stringDate = `${date}`;
    if (stringDate.charAt(stringDate.length - 1) === '1') {
      if (stringDate !== '11') {
        qualifiedDate = stringDate + 'st';
      } else {
        qualifiedDate = stringDate + 'th';
      }
    } else if (stringDate.charAt(stringDate.length - 1) === '2') {
      if (stringDate !== '12') {
        qualifiedDate = stringDate + 'nd';
      } else {
        qualifiedDate = stringDate + 'th';
      }
    } else if (stringDate.charAt(stringDate.length - 1) === '3') {
      if (stringDate !== '13') {
        qualifiedDate = stringDate + 'rd';
      } else {
        qualifiedDate = stringDate + 'th';
      }
    } else {
      qualifiedDate = stringDate + 'th';
    }
    return qualifiedDate;
  }
}
