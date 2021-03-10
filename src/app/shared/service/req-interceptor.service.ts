import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { map, first, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { isAuthenticated, getAuthToken } from './../../state/app.reducer';

import { AppState } from './../../state/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  constructor(private store: Store<AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.addToken(request).pipe(
      first(),
      mergeMap((requestWithToken: HttpRequest<any>) => next.handle(requestWithToken))
    );
  }

  private addToken(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    const authenticated$ = this.store.select(isAuthenticated);
    const authToken$ = this.store.select(getAuthToken);
    let clonedRequest: HttpRequest<any>;
    return combineLatest([
      authenticated$,
      authToken$
    ]).pipe(
      map(([auth, token]) => {
        if (auth) {
          clonedRequest = request.clone({
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
          });
        } else {
          clonedRequest = request.clone();
        }
        return clonedRequest;
      })
    );
  }
}
