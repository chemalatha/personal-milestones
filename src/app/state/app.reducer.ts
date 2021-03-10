import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as AppActions from './app.action';
import * as StorageActions from './../shared/module/storage';

interface User {
  email: string;
  firstname: string;
  lastname?: string;
}

/** Application state structure */
export interface AppState {
  authenticated: boolean;
  user: User;
  authToken: string;
  error: string;
}

/** Initial application state */
const initialState: AppState = {
  authenticated: false,
  user: {
    email: '',
    firstname: '',
    lastname: ''
  },
  authToken: '',
  error: ''
};

function getState() {
  const initialStateFromSession = StorageActions.getFromBrowserSession('state');
  return initialStateFromSession || initialState;
}

const getAppState = createFeatureSelector<AppState>('milestones');

export const isAuthenticated = createSelector(getAppState, state => state.authenticated);
export const getAuthToken = createSelector(getAppState, state => state.authToken);
export const getEmail = createSelector(getAppState, state => state.user.email);
export const getFirstName = createSelector(getAppState, state => state.user.firstname);
export const getLastName = createSelector(getAppState, state => state.user.lastname);
export const getName = createSelector(getAppState, state => state.user.firstname + (!!state.user.lastname ? (' ' + state.user.lastname) : ''));
export const getError = createSelector(getAppState, state => state.error);

const appreducer = createReducer<AppState>(
  getState(),
  on(AppActions.signinAction, AppActions.signoutAction, (state): AppState => {
    const newState = {
      ...state,
      error: ''
    };
    return newState;
  }),
  on(AppActions.signinSuccessAction, (state, action): AppState => {
    const newState = {
      ...state,
      error: '',
      user: action.authState.user,
      authToken: action.authState.token,
      authenticated: action.authState.auth
    };
    StorageActions.storeOnBrowserSession('state', newState);
    return newState;
  }),
  on(AppActions.signinFailureAction, (state, action): AppState => {
    const newState = {
      ...state,
      error: action.error,
      loading: false
    };
    return newState;
  }),
  on(AppActions.signoutSuccessAction, AppActions.signoutFailureAction, (): AppState => {
    StorageActions.clearAllApplicationsKeys();
    return {
      ...initialState
    };
  })
);

export function AppReducer(state: AppState, action: any) {
  return appreducer(state, action);
}
