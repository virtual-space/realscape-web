import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnExpCtrlComponent } from './rn-exp-ctrl.component';

describe('RnExpCtrlComponent', () => {
  let component: RnExpCtrlComponent;
  let fixture: ComponentFixture<RnExpCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnExpCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnExpCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
