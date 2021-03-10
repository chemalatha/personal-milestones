import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';

import * as AppActions from './../state/app.action';
import * as SharedActions from './../shared/state/shared.action';

import { AuthState } from './../shared/model/auth.interface';

import { AuthService } from './../auth/auth.service';
import { ErrorHandler } from '../shared/module/error-handler';

@Injectable()
export class AppEffects extends ErrorHandler {

  constructor(private action$: Actions, private auth: AuthService, private router: Router) {
    super();
  }

  signinEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(AppActions.signinAction),
    exhaustMap(action => this.auth.onSignin(action.email, action.password)
    .pipe(
      switchMap((state: AuthState) => [SharedActions.loadingAction({ loading: false }), AppActions.signinSuccessAction({ authState: state })]),
      tap(() => this.router.navigate(['/calendar'])),
      catchError((error: any) => from([SharedActions.loadingAction({ loading: false }), AppActions.signinFailureAction( { error: this.getErrorMessage(error) })]))
    ))
  ));

  signoutEffect$ = createEffect(() => this.action$
  .pipe(
    ofType(AppActions.signoutAction),
    exhaustMap(() => this.auth.onSignout()
    .pipe(
      switchMap(() => [SharedActions.loadingAction({ loading: false }), AppActions.signoutSuccessAction()]),
      tap(() => this.router.navigate(['/'])),
      catchError(() => { this.router.navigate(['/']); return from([SharedActions.loadingAction({ loading: false }), AppActions.signoutFailureAction()]); })
    ))
  ));
}
