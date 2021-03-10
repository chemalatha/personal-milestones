import { createAction, props } from '@ngrx/store';

import { AuthState } from './../shared/model/auth.interface';

export const signinAction = createAction(
  '[Milestones Auth] Signin',
  props<{ email: string, password: string }>()
);

export const signinSuccessAction = createAction(
  '[Milestones Auth] Signin Success',
  props<{ authState: AuthState }>()
);

export const signinFailureAction = createAction(
  '[Milestones Auth] Signin Failure',
  props<{ error: string }>()
);

export const signoutAction = createAction(
  '[Milestones Auth] Signout'
);

export const signoutSuccessAction = createAction(
  '[Milestones Auth] Signout Success'
);

export const signoutFailureAction = createAction(
  '[Milestones Auth] Signout Failure'
);
