import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTabsCtrlComponent } from './rn-tabs-ctrl.component';

describe('RnTabsCtrlComponent', () => {
  let component: RnTabsCtrlComponent;
  let fixture: ComponentFixture<RnTabsCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTabsCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTabsCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
