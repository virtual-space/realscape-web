import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnEditCtrlComponent } from './rn-edit-ctrl.component';

describe('RnEditCtrlComponent', () => {
  let component: RnEditCtrlComponent;
  let fixture: ComponentFixture<RnEditCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnEditCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnEditCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
