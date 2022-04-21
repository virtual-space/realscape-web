import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnFunctionViewComponent } from './rn-function-view.component';

describe('RnFunctionViewComponent', () => {
  let component: RnFunctionViewComponent;
  let fixture: ComponentFixture<RnFunctionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnFunctionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnFunctionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
