import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';

import { Milestone } from '../model/milestone.interface';

@Component({
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmDialogComponent implements OnInit {

  public message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.message = this.data.message || `Are you sure you want to continue with this operation?`;
  }

  onDialogAction(): void {
    this.dialogRef.close({ decision: true });
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false });
  }
}

@Component({
  templateUrl: './milestone-view-modal.component.html'
})
export class MilestoneViewDialogComponent implements OnInit {

  public message: string;

  constructor(public dialogRef: MatDialogRef<MilestoneViewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.message = this.data.description || ``;
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false });
  }
}

@Component({
  templateUrl: './milestone-entry-modal.component.html'
})
export class MilestoneEntryDialogComponent implements OnInit {

  private formData: Milestone;
  public mode: string;
  public maxDate = new Date();
  public milestoneForm: FormGroup;
  public activityCodes: string[];
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<MilestoneEntryDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.mode = this.data.mode;
    if (this.mode === 'create') {
      this.activityCodes = [];
      this.milestoneForm = this.fb.group({
        milestonedate: new FormControl({
          value: new Date(`${this.data.month}/${this.data.day}/${this.data.year}`),
          disabled: true
        }, [Validators.required]),
        description: ['', [Validators.required]]
      });
    } else {
      this.formData = this.data.milestone;
      this.activityCodes = [...this.formData.activitycodes];
      this.milestoneForm = this.fb.group({
        milestonedate: [new Date(`${this.data.month}/${this.data.day}/${this.data.year}`), [Validators.required]],
        description: [this.formData.description, [Validators.required]]
      });
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.activityCodes.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.activityCodes.indexOf(tag);
    if (index >= 0) {
      this.activityCodes.splice(index, 1);
    }
  }

  onDialogAction(): void {
    if (this.milestoneForm.valid) {
      let data: any = {};
      if (this.mode === 'create') {
        data = {
          ...this.milestoneForm.value,
          activitycodes: this.activityCodes,
          day: this.data.day,
          month: this.data.month,
          year: this.data.year,
        };
      } else {
        const milestonedate: Date = this.milestoneForm.value.milestonedate;
        data = {
          description: this.milestoneForm.value.description,
          activitycodes: this.activityCodes,
          day: milestonedate.getDate(),
          month: milestonedate.getMonth() + 1,
          year: milestonedate.getFullYear()
        };
      }
      this.dialogRef.close({ decision: true, data });
    }
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false, data: null });
  }
}
