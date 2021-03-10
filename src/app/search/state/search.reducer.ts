import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as AppActions from './../../state/app.action';
import * as SearchActions from './search.action';

import { Milestone } from './../../shared/model/milestone.interface';

import * as StorageActions from './../../shared/module/storage';

export interface SearchState {
  q: string;
  error: string;
  milestones: Milestone[];
  searched: boolean;
  searchType: string;
  searchDepth: string;
}

const initialSearchState: SearchState = {
  q: '',
  error: '',
  milestones: [],
  searched: false,
  searchDepth: 'all',
  searchType: 'tag'
};

function getState() {
  const initialStateFromSession = StorageActions.getFromBrowserSession('search_state');
  if (!initialStateFromSession) {
    StorageActions.storeOnBrowserSession('search_state', initialSearchState);
  }
  return initialStateFromSession || initialSearchState;
}

const getSearchState = createFeatureSelector<SearchState>('search');

export const getMilestones = createSelector(getSearchState, state => state.milestones);
export const getSearchString = createSelector(getSearchState, state => state.q);
export const getSearchError = createSelector(getSearchState, state => state.error);
export const isSearched = createSelector(getSearchState, state => state.searched);
export const getSearchType = createSelector(getSearchState, state => state.searchType);
export const getSearchDepth = createSelector(getSearchState, state => state.searchDepth);

const searchreducer = createReducer<SearchState>(
  getState(),
  on(SearchActions.clearErrorAction, (state): SearchState => {
    const newState: SearchState = {
      ...state,
      error: ''
    };
    StorageActions.storeOnBrowserSession('search_state', newState);
    return newState;
  }),
  on(SearchActions.searchTypeChangeAction, (state, action): SearchState => {
    const newState: SearchState = {
      ...initialSearchState,
      searchType: action.value
    };
    StorageActions.storeOnBrowserSession('search_state', newState);
    return newState;
  }),
  on(SearchActions.searchDepthChangeAction, (state, action): SearchState => {
    const newState: SearchState = {
      ...state,
      error: '',
      searchDepth: action.value
    };
    StorageActions.storeOnBrowserSession('search_state', newState);
    return newState;
  }),
  on(SearchActions.searchStringChangeAction, (state, action): SearchState => {
    const newState: SearchState = {
      ...state,
      error: '',
      q: action.value
    };
    StorageActions.storeOnBrowserSession('search_state', newState);
    return newState;
  }),
  on(SearchActions.searchEntriesSuccessAction, (state, action): SearchState => {
    const newState: SearchState = {
      ...state,
      error: '',
      milestones: action.milestones,
      searched: true
    };
    StorageActions.storeOnBrowserSession('search_state', newState);
    return newState;
  }),
  on(SearchActions.searchEntriesFailureAction, (state, action): SearchState => {
    const newState: SearchState = {
      ...state,
      error: action.error,
      searched: true
    };
    return newState;
  }),
  on(SearchActions.resetSearchEntriesAction, (state): SearchState => {
    const newState: SearchState = {
      ...state,
      error: '',
      searched: false,
      milestones: [],
      q: initialSearchState.q,
      searchDepth: initialSearchState.searchDepth
    };
    StorageActions.storeOnBrowserSession('search_state', newState);
    return newState;
  }),
  on(AppActions.signoutSuccessAction, AppActions.signoutFailureAction, (): SearchState => {
    return {
      ...initialSearchState
    };
  })
);

export function searchReducer(state: SearchState, action: any) {
  return searchreducer(state, action);
}
