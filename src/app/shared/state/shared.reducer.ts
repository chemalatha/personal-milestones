import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as SharedActions from './shared.action';

export interface SharedState {
  loading: boolean;
}

const initialState: SharedState = {
  loading: false
};

function getState() {
  return initialState;
}

const getSharedState = createFeatureSelector<SharedState>('core');

export const isLoading = createSelector(getSharedState, state => state.loading);

const sharedreducer = createReducer<SharedState>(
  getState(),
  on(SharedActions.loadingAction, (state, action): SharedState => {
    return {
      ...state,
      loading: action.loading
    };
  })
);

export function SharedReducer(state: SharedState, action: any) {
  return sharedreducer(state, action);
}
