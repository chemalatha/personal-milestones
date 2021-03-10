import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from './../shared/module/shared.module';
import { SearchRoutingModule } from './search-routing.module';

import { SearchService } from './search.service';

import { HoverDirective } from './../shared/directive/hover.directive';

import { SearchComponent } from './search.component';
import { SearchFormComponent } from '../search/search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';

import * as fromSearchReducer from './state/search.reducer';
import { SearchEffects } from './state/search.effect';

@NgModule({
  declarations: [
    SearchComponent,
    SearchFormComponent,
    SearchResultComponent,
    HoverDirective
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    StoreModule.forFeature('search', fromSearchReducer.searchReducer),
    EffectsModule.forFeature([ SearchEffects ])
  ],
  providers: [SearchService]
})
export class SearchModule {}
