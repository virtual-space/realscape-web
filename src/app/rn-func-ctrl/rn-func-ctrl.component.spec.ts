import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnFuncCtrlComponent } from './rn-func-ctrl.component';

describe('RnFuncCtrlComponent', () => {
  let component: RnFuncCtrlComponent;
  let fixture: ComponentFixture<RnFuncCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnFuncCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnFuncCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
