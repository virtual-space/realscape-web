import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCtrlComponent } from './rn-ctrl.component';

describe('RnCtrlComponent', () => {
  let component: RnCtrlComponent;
  let fixture: ComponentFixture<RnCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
