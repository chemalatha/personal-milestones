import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestConfigService } from './../shared/service/restconfig.service';
import { DeviceService } from './../shared/service/device.service';

import * as AppActions from './../state/app.action';
import { AppState, getError, getFirstName, getName, isAuthenticated } from './../state/app.reducer';
import * as SharedActions from './../shared/state/shared.action';
import { isLoading } from './../shared/state/shared.reducer';

import { AuthState } from '../shared/model/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store: Store<AppState>, private http: HttpClient, private rest: RestConfigService, private device: DeviceService, private router: Router) {}

  public isAuthenticated$: Observable<boolean> = this.store.select(isAuthenticated);
  public fullName$: Observable<string> = combineLatest([
    this.store.select(getFirstName),
    this.store.select(getName),
    this.device.getDeviceChangedListener()
  ]).pipe(
    map(([firstName, fullName, size]) => {
      if (size === 'xs') {
        return firstName;
      }
      return fullName;
    })
  );

  public authErrorMessage$: Observable<string> = this.store.select(getError);

  public signinBtnText$: Observable<string> = this.store.select(isLoading).pipe(
    map((loading: boolean) => loading ? 'Signing in, please wait...' : 'Sign in')
  );

  public redirect(): void {
    this.router.navigate(['/calendar']);
  }

  public signinAction(email: string, password: string) {
    this.store.dispatch(SharedActions.loadingAction({ loading: true }));
    this.store.dispatch(AppActions.signinAction({ email, password }));
  }

  public signinErrorAction(error?: string) {
    this.store.dispatch(AppActions.signinFailureAction({ error: error ? error : '' }));
  }

  public onSignin(email: string, password: string): Observable<AuthState> {
    return this.http.post<AuthState>(this.rest.signin(), { email, password });
  }

  public signoutAction() {
    this.store.dispatch(SharedActions.loadingAction({ loading: true }));
    this.store.dispatch(AppActions.signoutAction());
  }

  public onSignout() {
    return this.http.post<AuthState>(this.rest.signout(), null);
  }
}
