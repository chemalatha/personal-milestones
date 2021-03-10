import { createAction, props } from '@ngrx/store';

import { Milestone } from './../../shared/model/milestone.interface';

export const previousMonthAction = createAction(
  '[Calendar] Previous Month'
);

export const nextMonthAction = createAction(
  '[Calendar] Next Month'
);

export const changeDayAction = createAction(
  '[Calendar] Change Day',
  props<{ day: number }>()
);

export const getEntriesAction = createAction(
  '[Calendar] Get Milestones',
  props<{ q: string }>()
);

export const getEntriesSuccessAction = createAction(
  '[Calendar] Get Milestones Success',
  props<{ milestones: Milestone[] }>()
);

export const getEntriesFailureAction = createAction(
  '[Calendar] Get Milestones Failure',
  props<{ error: string }>()
);

export const addEntryAction = createAction(
  '[Calendar] Add Milestone',
  props<{ day: number, milestone: Milestone }>()
);

export const addEntrySuccessAction = createAction(
  '[Calendar] Add Milestone Success',
  props<{ day: number, milestone: Milestone }>()
);

export const addEntryFailureAction = createAction(
  '[Calendar] Add Milestone Failure',
  props<{ error: string }>()
);

export const editEntryAction = createAction(
  '[Calendar] Edit Milestone',
  props<{ day: number, milestoneid: number, milestone: Milestone }>()
);

export const editEntrySuccessAction = createAction(
  '[Calendar] Edit Milestone Success',
  props<{ day: number, milestone: Milestone }>()
);

export const editEntryFailureAction = createAction(
  '[Calendar] Edit Milestone Failure',
  props<{ error: string }>()
);

export const deleteEntryAction = createAction(
  '[Calendar] Delete Milestone',
  props<{ milestoneid: number }>()
);

export const deleteEntrySuccessAction = createAction(
  '[Calendar] Delete Milestone Success',
  props<{ milestone: Milestone }>()
);

export const deleteEntryFailureAction = createAction(
  '[Calendar] Delete Milestone Failure',
  props<{ error: string }>()
);

export const toggleWeekViewAction = createAction(
  '[Calendar] Toggle Week View'
);

export const clearErrorAction = createAction(
  '[Calendar] Clear Error'
);
