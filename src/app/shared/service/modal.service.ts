import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Milestone } from './../model/milestone.interface';

import { DeviceService } from './device.service';

import { ConfirmDialogComponent, MilestoneEntryDialogComponent, MilestoneViewDialogComponent } from './../component/calendar-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private device: DeviceService, private dialog: MatDialog, private snackbar: MatSnackBar) {}

  public showConfirmDialog(message: string): Observable<{ decision: boolean }> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: this.device.isSFF() ? '96vw' : '35vw',
      maxWidth: this.device.isSFF() ? '96vw' : '35vw',
      disableClose: true,
      data: { message }
    });
    return dialogRef.afterClosed();
  }

  public showAddDialog(day: number, month: number, year: number): Observable<{ decision: boolean, data: any | null }> {
    const dialogRef = this.dialog.open(MilestoneEntryDialogComponent, {
      width: this.device.isSFF() ? '96vw' : '35vw',
      maxWidth: this.device.isSFF() ? '96vw' : '35vw',
      disableClose: true,
      data: { mode: 'create', day, month, year }
    });
    return dialogRef.afterClosed();
  }

  public showEditDialog(day: number, month: number, year: number, milestone: Milestone): Observable<{ decision: boolean, data: any | null }> {
    const dialogRef = this.dialog.open(MilestoneEntryDialogComponent, {
      width: this.device.isSFF() ? '96vw' : '35vw',
      maxWidth: this.device.isSFF() ? '96vw' : '35vw',
      disableClose: true,
      data: { mode: 'edit', day, month, year, milestone }
    });
    return dialogRef.afterClosed();
  }

  public showViewDialog(description: string): Observable<void> {
    const dialogRef = this.dialog.open(MilestoneViewDialogComponent, {
      width: this.device.isSFF() ? '96vw' : '40vw',
      maxWidth: this.device.isSFF() ? '96vw' : '40vw',
      disableClose: true,
      data: { description }
    });
    return dialogRef.afterClosed();
  }

  public showSuccessSnackbar(message: string, action?: string, duration = 4000, panelClass = 'snackbar-success') {
    this.showSnackbar(message, panelClass, duration, action);
  }

  public showErrorSnackbar(message: string, action?: string, duration = 4000, panelClass = 'snackbar-error') {
    this.showSnackbar(message, panelClass, duration, action);
  }

  private showSnackbar(message: string, panelClass?: string, duration?: number, action?: string) {
    this.snackbar.open(message, action, { duration, panelClass });
  }
}
