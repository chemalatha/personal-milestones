import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { ErrorHandler } from '../../shared/module/error-handler';
import { SearchService } from './../search.service';

import { Milestone } from './../../shared/model/milestone.interface';

import * as SharedActions from './../../shared/state/shared.action';
import * as SearchActions from './search.action';

@Injectable()
export class SearchEffects extends ErrorHandler {

  constructor(private action$: Actions, private searchService: SearchService) {
    super();
  }

  searchMilestonesEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(SearchActions.searchEntriesAction),
    mergeMap(action => this.searchService.search(action.params)
    .pipe(
      switchMap((data: Milestone[]) => [SharedActions.loadingAction({ loading: false }), SearchActions.searchEntriesSuccessAction({ milestones: data })]),
      catchError((error: any) => from([SharedActions.loadingAction({ loading: false }), SearchActions.searchEntriesFailureAction( { error: this.getErrorMessage(error) })]))
    ))
  ));
}
