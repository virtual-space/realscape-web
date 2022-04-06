import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnDrawingViewComponent } from './rn-drawing-view.component';

describe('RnDrawingViewComponent', () => {
  let component: RnDrawingViewComponent;
  let fixture: ComponentFixture<RnDrawingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnDrawingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnDrawingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
