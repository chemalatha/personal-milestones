import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  public isProd(): boolean {
    return environment.production;
  }

  public getHost(): string {
    return environment.host;
  }

  public getBasePath(): string {
    return environment.basePath;
  }
}
