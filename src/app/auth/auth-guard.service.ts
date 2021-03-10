import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState, isAuthenticated } from './../state/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {

  constructor(private store: Store<AppState>, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.canActivate(null, null);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(isAuthenticated)
    .pipe(
      map((authenticated: boolean) => {
        if (!authenticated) {
          this.router.navigate(['/']);
        }
        return authenticated;
      })
    );
  }
}
