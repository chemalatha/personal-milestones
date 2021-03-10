import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as AppActions from './../../state/app.action';
import * as CalendarActions from './calendar.action';

import { Milestone } from './../../shared/model/milestone.interface';

import * as StorageActions from './../../shared/module/storage';

const _DAY = 'day';
const _MONTH = 'month';
const _YEAR = 'year';

function getCurrent(identifier: string) {
  const currentDate: Date = new Date();
  if (identifier === _DAY) {
    return currentDate.getDate();
  } else if (identifier === _MONTH) {
    return currentDate.getMonth() + 1;
  } else if (identifier === _YEAR) {
    return currentDate.getFullYear();
  }
}

export interface CalendarState {
  day: number;
  editDay: number;
  month: number;
  year: number;
  error: string;
  weekView: boolean;
  milestones: Milestone[];
}

const initialCalendarState: CalendarState = {
  day: getCurrent(_DAY),
  editDay: getCurrent(_DAY),
  month: getCurrent(_MONTH),
  year: getCurrent(_YEAR),
  error: '',
  weekView: false,
  milestones: []
};

function getState() {
  const initialStateFromSession = StorageActions.getFromBrowserSession('calendar_state');
  if (!initialStateFromSession) {
    StorageActions.storeOnBrowserSession('calendar_state', initialCalendarState);
  }
  return initialStateFromSession || initialCalendarState;
}

const getCalendarState = createFeatureSelector<CalendarState>('calendar');

export const getMilestones = createSelector(getCalendarState, state => state.milestones);
export const getCurrentDay = createSelector(getCalendarState, state => state.day);
export const getCurrentEditDay = createSelector(getCalendarState, state => state.editDay);
export const getCurrentMonth = createSelector(getCalendarState, state => state.month);
export const getCurrentYear = createSelector(getCalendarState, state => state.year);
export const getCurrentDate = createSelector(getCalendarState, state => `${state.month}-${state.day}-${state.year}`);
export const getCurrentMonthYear = createSelector(getCalendarState, state => `${state.month}-1-${state.year}`);
export const getCalendarError = createSelector(getCalendarState, state => state.error);
export const showWeekView = createSelector(getCalendarState, state => state.weekView);

const calendarreducer = createReducer<CalendarState>(
  getState(),
  on(CalendarActions.clearErrorAction, (state): CalendarState => {
    return {
      ...state,
      error: ''
    };
  }),
  on(CalendarActions.toggleWeekViewAction, (state): CalendarState => {
    const newState: CalendarState = {
      ...state,
      weekView: !state.weekView
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.changeDayAction, (state, action): CalendarState => {
    const newState: CalendarState = {
      ...state,
      editDay: action.day
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.previousMonthAction, (state): CalendarState => {
    let previousMonth = state.month - 1;
    let previousYear = state.year;
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear -= 1;
    }
    const newState: CalendarState = {
      ...state,
      month: previousMonth,
      year: previousYear,
      error: ''
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.nextMonthAction, (state): CalendarState => {
    let nextMonth = state.month + 1;
    let nextYear = state.year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const newState: CalendarState = {
      ...state,
      month: nextMonth,
      year: nextYear,
      error: ''
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.getEntriesAction, (state): CalendarState => {
    const newState: CalendarState = {
      ...state,
      milestones: [],
      error: ''
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.getEntriesSuccessAction, (state, action): CalendarState => {
    const newState: CalendarState = {
      ...state,
      milestones: action.milestones,
      error: ''
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.addEntrySuccessAction, (state, action): CalendarState => {
    const newState: CalendarState = {
      ...state,
      milestones: [...state.milestones, action.milestone],
      error: ''
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.editEntrySuccessAction, (state, action): CalendarState => {
    const monthFromState: number = state.month;
    const yearFromState: number = state.year;
    const editedMilestone = action.milestone;
    const milestonesFromState = state.milestones;
    if (editedMilestone.day === action.day && editedMilestone.month === monthFromState && editedMilestone.year === yearFromState) {
      const milestones = milestonesFromState.map((milestone: Milestone) => {
        if (milestone.milestoneid === action.milestone.milestoneid) {
          return action.milestone;
        }
        return milestone;
      });
      const newState: CalendarState = {
        ...state,
        milestones,
        error: ''
      };
      StorageActions.storeOnBrowserSession('calendar_state', newState);
      return newState;
    } else {
      const newState: CalendarState = {
        ...state,
        milestones: milestonesFromState.filter((each: Milestone) => each.milestoneid !== editedMilestone.milestoneid),
        error: ''
      };
      StorageActions.storeOnBrowserSession('calendar_state', newState);
      return newState;
    }
  }),
  on(CalendarActions.deleteEntrySuccessAction, (state, action): CalendarState => {
    const milestonesFromState: Milestone[] = state.milestones;
    const deletedMilestone = action.milestone;
    const newState: CalendarState = {
      ...state,
      milestones: milestonesFromState.filter((each: Milestone) => each.milestoneid !== deletedMilestone.milestoneid),
      error: ''
    };
    StorageActions.storeOnBrowserSession('calendar_state', newState);
    return newState;
  }),
  on(CalendarActions.getEntriesFailureAction,
     CalendarActions.addEntryFailureAction,
     CalendarActions.editEntryFailureAction,
     CalendarActions.deleteEntryFailureAction, (state, action): CalendarState => {
    const newState: CalendarState = {
      ...state,
      error: action.error
    };
    return newState;
  }),
  on(AppActions.signoutSuccessAction, AppActions.signoutFailureAction, (): CalendarState => {
    return {
      ...initialCalendarState
    };
  })
);

export function calendarReducer(state: CalendarState, action: any) {
  return calendarreducer(state, action);
}
