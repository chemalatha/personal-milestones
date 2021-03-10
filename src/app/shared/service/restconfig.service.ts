import { Injectable } from '@angular/core';

import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class RestConfigService {

  constructor(private env: EnvironmentService) {}

  public signin(): string {
    return `${this.getRestHost()}/user/login`;
  }

  public signout(): string {
    return `${this.getRestHost()}/user/logout`;
  }

  public milestones(q: string, findBy = 'date', depth = 'in'): string {
    if (findBy === 'tag') {
      return `${this.getRestHost()}/milestone?q=${q}&findBy=${findBy}&depth=${depth}`;
    }
    return `${this.getRestHost()}/milestone?q=${q}&findBy=${findBy}`;
  }

  public activities(q: string): string {
    return `${this.getRestHost()}/activity?q=${q}`;
  }

  public addMilestone(): string {
    return `${this.getRestHost()}/milestone`;
  }

  public updateOrDeleteMilestone(milestoneid: number): string {
    return `${this.getRestHost()}/milestone/${milestoneid}`;
  }

  private getRestHost(): string {
    return this.env.getHost() + this.env.getBasePath();
  }
}
