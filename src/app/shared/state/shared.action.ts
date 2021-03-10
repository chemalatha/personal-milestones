import { createAction, props } from '@ngrx/store';

export const loadingAction = createAction(
  '[Core] Loading',
  props<{ loading: boolean }>()
);
