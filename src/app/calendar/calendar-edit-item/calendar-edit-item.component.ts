import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { TextShortenPipe } from './../../shared/pipe/text-shorten.pipe';

import { Milestone } from './../../shared/model/milestone.interface';

@Component({
  selector: 'app-calendar-edit-item',
  templateUrl: './calendar-edit-item.component.html',
  styleUrls: ['./calendar-edit-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarEditItemComponent implements OnInit, OnChanges {

  @Input() milestone: Milestone;
  @Input() formFactor: string;
  @Output() editMilestone = new EventEmitter<Milestone>();
  @Output() deleteMilestone = new EventEmitter<number>();
  @Output() viewMilestone = new EventEmitter<string>();

  public shortenedSize: number;
  public readMoreVisible: boolean;

  private textShortenPipe: TextShortenPipe;

  constructor() {
    this.textShortenPipe = new TextShortenPipe();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.formFactor === 'xs') {
      this.shortenedSize = 500;
    } else if (this.formFactor === 'sm') {
      this.shortenedSize = 550;
    } else if (this.formFactor === 'md') {
      this.shortenedSize = 550;
    } else {
      this.shortenedSize = 600;
    }
    this.readMoreVisible = !!this.milestone.description &&
                             (this.milestone.description.length >
                              this.textShortenPipe.getShortenedString(this.milestone.description, this.shortenedSize, false).length);
  }

  onEditMilestone(): void {
    this.editMilestone.emit(this.milestone);
  }

  onDeleteMilestone(): void {
    this.deleteMilestone.emit(this.milestone.milestoneid);
  }

  onViewMilestone(): void {
    this.viewMilestone.emit(this.milestone.description);
  }

}
