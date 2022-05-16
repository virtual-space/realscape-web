import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTabCtrlComponent } from './rn-tab-ctrl.component';

describe('RnTabCtrlComponent', () => {
  let component: RnTabCtrlComponent;
  let fixture: ComponentFixture<RnTabCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTabCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTabCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
