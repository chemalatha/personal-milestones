import { createAction, props } from '@ngrx/store';

import { ISearch } from './../search.interface';
import { Milestone } from './../../shared/model/milestone.interface';

export const searchEntriesAction = createAction(
  '[Search] Search Milestones',
  props<{ params: ISearch }>()
);

export const searchTypeChangeAction = createAction(
  '[Search] Change Search Type',
  props<{ value: string }>()
);

export const searchDepthChangeAction = createAction(
  '[Search] Change Search Depth',
  props<{ value: string }>()
);

export const searchStringChangeAction = createAction(
  '[Search] Change Search String',
  props<{ value: string }>()
);

export const searchEntriesSuccessAction = createAction(
  '[Search] Search Milestones Success',
  props<{ milestones: Milestone[] }>()
);

export const searchEntriesFailureAction = createAction(
  '[Search] Search Milestones Failure',
  props<{ error: string }>()
);

export const resetSearchEntriesAction = createAction(
  '[Search] Reset Search Milestones'
);

export const clearErrorAction = createAction(
  '[Search] Clear Error'
);
