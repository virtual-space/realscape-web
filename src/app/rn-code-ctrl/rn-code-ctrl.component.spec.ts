import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCodeCtrlComponent } from './rn-code-ctrl.component';

describe('RnCodeCtrlComponent', () => {
  let component: RnCodeCtrlComponent;
  let fixture: ComponentFixture<RnCodeCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCodeCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCodeCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
