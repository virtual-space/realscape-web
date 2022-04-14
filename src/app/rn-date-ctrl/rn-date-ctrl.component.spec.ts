import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnDateCtrlComponent } from './rn-date-ctrl.component';

describe('RnDateCtrlComponent', () => {
  let component: RnDateCtrlComponent;
  let fixture: ComponentFixture<RnDateCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnDateCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnDateCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
