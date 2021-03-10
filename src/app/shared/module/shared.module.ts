import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { TextShortenPipe } from './../pipe/text-shorten.pipe';
import { ConfirmDialogComponent, MilestoneEntryDialogComponent, MilestoneViewDialogComponent } from './../../shared/component/calendar-modal.component';

import { RequestInterceptorService } from './../../shared/service/req-interceptor.service';

import { AppMaterialModule } from './app-material.module';
import { SharedReducer } from './../state/shared.reducer';

@NgModule({
  declarations: [
    TextShortenPipe,
    ConfirmDialogComponent,
    MilestoneViewDialogComponent,
    MilestoneEntryDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AppMaterialModule,
    StoreModule.forFeature('core', SharedReducer)
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AppMaterialModule,
    TextShortenPipe,
    StoreModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptorService,
    multi: true
  },
  NgxSpinnerService]
})
export class SharedModule {}
