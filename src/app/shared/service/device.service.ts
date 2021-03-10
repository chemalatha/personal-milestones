import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private deviceSize: string;
  private deviceSizeChanged = new Subject<string>();

  public getDeviceChangedListener(): Observable<string> {
    return this.deviceSizeChanged.asObservable().pipe(
      startWith(this.calculateDeviceSize())
    );
  }

  public getDeviceSize(): string {
    return this.deviceSize;
  }

  private setDeviceSize(deviceSize: string): void {
    this.deviceSize = deviceSize;
  }

  public isSFF(): boolean {
    return (this.getDeviceSize() === 'xs' || this.getDeviceSize() === 'sm');
  }

  public setDeviceWidth(): void {
    const size = this.calculateDeviceSize();
    this.setDeviceSize(size);
    this.deviceSizeChanged.next(size);
  }

  private calculateDeviceSize(): string {
    const deviceSize: number = window.innerWidth;
    let size: string;
    if (deviceSize < 768) {
      size = 'xs';
    } else if (deviceSize >= 768 && deviceSize <= 992) {
      size = 'sm';
    } else if (deviceSize > 992 && deviceSize <= 1200) {
      size = 'md';
    } else if (deviceSize > 1200) {
      size = 'lg';
    }
    return size;
  }

}
