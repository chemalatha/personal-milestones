import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Milestone } from './../shared/model/milestone.interface';
import { ISearch } from './search.interface';

import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchString$: Observable<string[]>;
  public errorMessage$: Observable<string>;
  public milestones$: Observable<Milestone[]>;
  public isSearched$: Observable<boolean>;
  public searchType$: Observable<string>;
  public searchDepth$: Observable<string>;
  public activities$: Observable<string[]>;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchString$ = this.searchService.searchString$.pipe(
      map((q: string) => !!q ? q.split(',') : [])
    );
    this.errorMessage$ = this.searchService.errorMessage$;
    this.milestones$ = this.searchService.milestones$;
    this.isSearched$ = this.searchService.isSearched$;
    this.searchType$ = this.searchService.searchType$;
    this.searchDepth$ = this.searchService.searchDepth$;
    this.activities$ = this.searchService.autocompleteActivity$;
  }

  search(params: ISearch): void {
    const query: string = params.q;
    if (!!query && query.length > 0) {
      this.searchService.searchAction(params);
    }
  }

  reset(): void {
    this.searchService.resetSearchAction();
  }

  view(description: string): void {
    this.searchService.viewAction(description);
  }

  dismissError(): void {
    this.searchService.dismissError();
  }

  searchTypeChange(value: string): void {
    this.searchService.searchTypeChange(value);
  }

  searchDepthChange(value: string): void {
    this.searchService.searchDepthChange(value);
  }

  searchStringChange(value: string): void {
    this.searchService.searchStringChange(value);
  }

  searchStringInputChange(value: string): void {
    this.searchService.setActivityInput(value);
  }

}
