import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnHiddenCtrlComponent } from './rn-hidden-ctrl.component';

describe('RnHiddenCtrlComponent', () => {
  let component: RnHiddenCtrlComponent;
  let fixture: ComponentFixture<RnHiddenCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnHiddenCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnHiddenCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
