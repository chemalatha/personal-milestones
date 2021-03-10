import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { ISearch } from './../search.interface';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit, OnChanges {

  @ViewChild('activityInput') activityInput: ElementRef<HTMLInputElement>;

  @Input() searchString: string[];
  @Input() searchType: string;
  @Input() searchDepth: string;
  @Input() activities: string[];
  @Output() searchFormSubmit = new EventEmitter<ISearch>();
  @Output() searchFormReset = new EventEmitter<void>();
  @Output() searchTypeChange = new EventEmitter<string>();
  @Output() searchDepthChange = new EventEmitter<string>();
  @Output() searchStringChange = new EventEmitter<string>();
  @Output() searchStringInputChange = new EventEmitter<string>();
  public activityCodesInput: string[];
  public searchStartDate: Date;
  public searchEndDate: Date;
  public matOptionActivated: boolean;
  public readonly separatorKeysCodes: number[] = [ENTER];

  constructor() { }

  ngOnInit(): void {
    this.matOptionActivated = false;
  }

  ngOnChanges(): void {
    if (this.searchType === 'tag') {
      this.activityCodesInput = [...this.searchString];
    } else if (this.searchType === 'daterange') {
      const dateRanges = [...this.searchString];
      if (dateRanges.length === 2) {
        this.searchStartDate = new Date(dateRanges[0]);
        this.searchEndDate = new Date(dateRanges[1]);
      } else {
        this.searchStartDate = null;
        this.searchEndDate = null;
      }
    }
  }

  select(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if ((value || '').trim()) {
      this.activityInput.nativeElement.value = '';
      this.activityCodesInput.push(value.trim());
      this.searchStringChange.emit(this.activityCodesInput.join(','));
      this.searchStringInputChange.emit('');
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim() && !this.matOptionActivated) {
      this.activityCodesInput.push(value.trim());
      this.searchStringChange.emit(this.activityCodesInput.join(','));
      this.searchStringInputChange.emit('');
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.activityCodesInput.indexOf(tag);
    if (index >= 0) {
      this.activityCodesInput.splice(index, 1);
      this.searchStringChange.emit(this.activityCodesInput.join(','));
    }
  }

  activate(event: MatAutocompleteActivatedEvent): void {
    this.matOptionActivated = true;
  }

  onRadioToggle(event: MatRadioChange): void {
    this.searchTypeChange.emit(event.value);
  }

  onButtonToggle(event: MatButtonToggleChange): void {
    this.searchDepthChange.emit(event.value);
  }

  onEndDateChange(): void {
    const startDate: Date = this.searchStartDate;
    const endDate: Date = this.searchEndDate;
    if (!!startDate && !!endDate) {
      const q = `${startDate.getMonth() + 1}-${startDate.getDate()}-${startDate.getFullYear()},${endDate.getMonth() + 1}-${endDate.getDate()}-${endDate.getFullYear()}`;
      this.searchStringChange.emit(q);
    }
  }

  onInput(event: KeyboardEvent): void {
    this.matOptionActivated = false;
    this.searchStringInputChange.emit((event.target as HTMLInputElement).value);
  }

  search(): void {
    const params: ISearch = {
      type: this.searchType,
      depth: null,
      q: ''
    };
    if (params.type === 'tag') {
      params.q = (!!this.searchString && Array.isArray(this.searchString)) ? this.searchString.join(',') : '';
      params.depth = this.searchDepth;
      this.searchFormSubmit.emit(params);
    } else {
      const startDate: Date = this.searchStartDate;
      const endDate: Date = this.searchEndDate;
      if (!!startDate && !!endDate) {
        params.q = `${startDate.getMonth() + 1}-${startDate.getDate()}-${startDate.getFullYear()},${endDate.getMonth() + 1}-${endDate.getDate()}-${endDate.getFullYear()}`;
        this.searchFormSubmit.emit(params);
      }
    }
  }

  reset(): void {
    this.searchFormReset.emit();
  }

}
