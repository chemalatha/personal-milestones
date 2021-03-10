import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

export abstract class ErrorHandler {

  private timeoutMessage = 'Milestones server is unresponsive';
  private unauthorizedMessage = 'Your session has been invalidated. Please log out and log in again';

  constructor() { }

  public getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return this.unauthorizedMessage;
      } else if (error.status === 400 || error.status === 404 || error.status === 500) {
        return (error.error.error as string);
      }
    }
    if (error instanceof TimeoutError || error instanceof HttpErrorResponse) {
      return this.timeoutMessage;
    }
    return (error.error.error as string);
  }
}
