import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnFormCtrlComponent } from './rn-form-ctrl.component';

describe('RnFormCtrlComponent', () => {
  let component: RnFormCtrlComponent;
  let fixture: ComponentFixture<RnFormCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnFormCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnFormCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
