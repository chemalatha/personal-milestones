import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isAuthenticated$: Observable<boolean>;
  public fullName$: Observable<string>;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
    this.fullName$ = this.auth.fullName$;
  }

  onMenuClick(option?: string): void {
    if (option === 'signout') {
      this.auth.signoutAction();
    }
  }

}
