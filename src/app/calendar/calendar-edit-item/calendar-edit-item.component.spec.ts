import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEditItemComponent } from './calendar-edit-item.component';

describe('CalendarEditItemComponent', () => {
  let component: CalendarEditItemComponent;
  let fixture: ComponentFixture<CalendarEditItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarEditItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
