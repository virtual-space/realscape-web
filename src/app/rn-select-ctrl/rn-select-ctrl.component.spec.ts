import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnSelectCtrlComponent } from './rn-select-ctrl.component';

describe('RnSelectCtrlComponent', () => {
  let component: RnSelectCtrlComponent;
  let fixture: ComponentFixture<RnSelectCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnSelectCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnSelectCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
