import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

import { DeviceService } from './shared/service/device.service';

import { AppState } from './state/app.reducer';
import { isLoading } from './shared/state/shared.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public isLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>,
              private spinner: NgxSpinnerService,
              private device: DeviceService,
              update: SwUpdate) {
    update.available.subscribe({
      next: () => update.activateUpdate().then(() => document.location.reload())
    });
  }

  ngOnInit() {
    this.device.setDeviceWidth();
    this.isLoading$ = this.store.select(isLoading).pipe(
      map((loading: boolean) => {
        if (loading) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
        return loading;
      })
    );
  }

  public onResize(): void {
    this.device.setDeviceWidth();
  }
}
