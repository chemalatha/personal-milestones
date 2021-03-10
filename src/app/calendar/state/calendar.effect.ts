import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ErrorHandler } from '../../shared/module/error-handler';
import { CalendarService } from './../calendar.service';
import { ModalService } from './../../shared/service/modal.service';

import { Milestone } from './../../shared/model/milestone.interface';

import * as SharedActions from './../../shared/state/shared.action';
import * as CalendarActions from './calendar.action';

@Injectable()
export class CalendarEffects extends ErrorHandler {

  constructor(private action$: Actions, private calendarService: CalendarService, private modal: ModalService) {
    super();
  }

  getMilestonesEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(CalendarActions.getEntriesAction),
    mergeMap(action => this.calendarService.getMilestones(action.q)
    .pipe(
      switchMap((data: Milestone[]) => [SharedActions.loadingAction({ loading: false }), CalendarActions.getEntriesSuccessAction({ milestones: data })]),
      catchError((error: any) => from([SharedActions.loadingAction({ loading: false }), CalendarActions.getEntriesFailureAction( { error: this.getErrorMessage(error) })]))
    ))
  ));

  addMilestoneEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(CalendarActions.addEntryAction),
    mergeMap(action => this.calendarService.addMilestone(action.milestone)
    .pipe(
      tap(() => this.modal.showSuccessSnackbar(`A new milestone entry has been created`)),
      switchMap((milestone: Milestone) => [SharedActions.loadingAction({ loading: false }), CalendarActions.addEntrySuccessAction({ day: action.day, milestone })]),
      catchError((error: any) => from([SharedActions.loadingAction({ loading: false }), CalendarActions.addEntryFailureAction( { error: this.getErrorMessage(error) })]))
    ))
  ));

  editMilestoneEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(CalendarActions.editEntryAction),
    mergeMap(action => this.calendarService.updateMilestone(action.milestoneid, action.milestone)
    .pipe(
      tap(() => this.modal.showSuccessSnackbar(`Your milestone entry has been updated`)),
      switchMap((milestone: Milestone) => [SharedActions.loadingAction({ loading: false }), CalendarActions.editEntrySuccessAction({ day: action.day, milestone })]),
      catchError((error: any) => from([SharedActions.loadingAction({ loading: false }), CalendarActions.editEntryFailureAction( { error: this.getErrorMessage(error) })]))
    ))
  ));

  deleteMilestoneEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(CalendarActions.deleteEntryAction),
    mergeMap(action => this.calendarService.deleteMilestone(action.milestoneid)
    .pipe(
      tap(() => this.modal.showSuccessSnackbar(`Your milestone entry has been deleted`)),
      switchMap((milestone: Milestone) => [SharedActions.loadingAction({ loading: false }), CalendarActions.deleteEntrySuccessAction({ milestone })]),
      catchError((error: any) => from([SharedActions.loadingAction({ loading: false }), CalendarActions.deleteEntryFailureAction( { error: this.getErrorMessage(error) })]))
    ))
  ));
}
