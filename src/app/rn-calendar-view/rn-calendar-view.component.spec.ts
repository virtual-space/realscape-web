import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCalendarViewComponent } from './rn-calendar-view.component';

describe('RnCalendarViewComponent', () => {
  let component: RnCalendarViewComponent;
  let fixture: ComponentFixture<RnCalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCalendarViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
