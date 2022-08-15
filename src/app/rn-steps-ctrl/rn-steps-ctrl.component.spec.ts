import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnStepsCtrlComponent } from './rn-steps-ctrl.component';

describe('RnStepsCtrlComponent', () => {
  let component: RnStepsCtrlComponent;
  let fixture: ComponentFixture<RnStepsCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnStepsCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnStepsCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
