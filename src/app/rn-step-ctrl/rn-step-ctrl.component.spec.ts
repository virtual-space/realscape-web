import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnStepCtrlComponent } from './rn-step-ctrl.component';

describe('RnStepCtrlComponent', () => {
  let component: RnStepCtrlComponent;
  let fixture: ComponentFixture<RnStepCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnStepCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnStepCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
