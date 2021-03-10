import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit, OnDestroy {

  public signinForm: FormGroup;
  public authErrorMessage$: Observable<string>;
  public signinBtnText$: Observable<string>;

  private authenticatedSub: Subscription;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.authenticatedSub = this.auth.isAuthenticated$.subscribe({
      next: (authenticated: boolean) => authenticated ? this.auth.redirect() : null
    });
  }

  ngOnInit(): void {
    this.authErrorMessage$ = this.auth.authErrorMessage$;
    this.signinBtnText$ = this.auth.signinBtnText$;
    this.signinForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (!!this.authenticatedSub) {
      this.authenticatedSub.unsubscribe();
    }
  }

  onSignin(): void {
    const username = this.signinForm.value.username;
    const password = this.signinForm.value.password;

    if ((!username) || (username == null) || (!password) || (password == null)) {
      this.auth.signinErrorAction(`Username or password cannot be empty`);
      return;
    }
    this.auth.signinAction(username, password);
  }

}
