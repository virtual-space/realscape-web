import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnAccordionCtrlComponent } from './rn-accordion-ctrl.component';

describe('RnAccordionCtrlComponent', () => {
  let component: RnAccordionCtrlComponent;
  let fixture: ComponentFixture<RnAccordionCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnAccordionCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnAccordionCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
