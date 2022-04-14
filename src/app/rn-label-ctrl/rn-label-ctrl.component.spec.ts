import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnLabelCtrlComponent } from './rn-label-ctrl.component';

describe('RnLabelCtrlComponent', () => {
  let component: RnLabelCtrlComponent;
  let fixture: ComponentFixture<RnLabelCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnLabelCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnLabelCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
