import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { ISearch } from './search.interface';
import { Milestone } from './../shared/model/milestone.interface';

import { RestConfigService } from './../shared/service/restconfig.service';
import { ModalService } from './../shared/service/modal.service';

import * as SharedActions from './../shared/state/shared.action';
import * as SearchActions from './state/search.action';
import {
  SearchState,
  getSearchString,
  getMilestones,
  getSearchError,
  isSearched,
  getSearchDepth,
  getSearchType
} from './state/search.reducer';

@Injectable()
export class SearchService {

  constructor(private store: Store<SearchState>, private http: HttpClient, private rest: RestConfigService, private modal: ModalService) {}

  public searchString$: Observable<string> = this.store.select(getSearchString);
  public errorMessage$: Observable<string> = this.store.select(getSearchError);
  public milestones$: Observable<Milestone[]> = this.store.select(getMilestones);
  public isSearched$: Observable<boolean> = this.store.select(isSearched);
  public searchType$: Observable<string> = this.store.select(getSearchType);
  public searchDepth$: Observable<string> = this.store.select(getSearchDepth);

  private activityInputSubject = new BehaviorSubject<string>('');
  private activityInput$ = this.activityInputSubject.asObservable();

  public autocompleteActivity$ = this.activityInput$.pipe(
    debounceTime(250),
    switchMap((input: string) => (!!input && input.trim().length > 2) ?
                                 this.http.get<string[]>(this.rest.activities(input.toLowerCase())) :
                                 of([])
    )
  );

  public setActivityInput(q: string): void {
    this.activityInputSubject.next(q);
  }

  public searchAction(params: ISearch) {
    this.store.dispatch(SharedActions.loadingAction({ loading: true }));
    return this.store.dispatch(SearchActions.searchEntriesAction({ params }));
  }

  public search(params: ISearch) {
    return this.http.get<Milestone[]>(this.rest.milestones(params.q, params.type, params.depth));
  }

  public resetSearchAction(): void {
    this.store.dispatch(SearchActions.resetSearchEntriesAction());
  }

  public viewAction(description: string): void {
    this.modal.showViewDialog(description).subscribe();
  }

  public dismissError(): void {
    this.store.dispatch(SearchActions.clearErrorAction());
  }

  public searchTypeChange(value: string): void {
    this.store.dispatch(SearchActions.searchTypeChangeAction({ value }));
  }

  public searchDepthChange(value: string): void {
    this.store.dispatch(SearchActions.searchDepthChangeAction({ value }));
  }

  public searchStringChange(value: string): void {
    this.store.dispatch(SearchActions.searchStringChangeAction({ value }));
  }
}
