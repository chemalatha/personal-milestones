import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Milestone } from './../../shared/model/milestone.interface';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultComponent implements OnInit {

  @Input() milestones: Milestone[];
  @Input() searched: boolean;
  @Output() viewMilestone = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  view(description: string): void {
    this.viewMilestone.emit(description);
  }

}
