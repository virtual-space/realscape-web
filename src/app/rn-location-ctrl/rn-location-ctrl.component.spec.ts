import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnLocationCtrlComponent } from './rn-location-ctrl.component';

describe('RnLocationCtrlComponent', () => {
  let component: RnLocationCtrlComponent;
  let fixture: ComponentFixture<RnLocationCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnLocationCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnLocationCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
