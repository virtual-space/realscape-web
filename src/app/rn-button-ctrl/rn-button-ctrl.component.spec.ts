import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnButtonCtrlComponent } from './rn-button-ctrl.component';

describe('RnButtonCtrlComponent', () => {
  let component: RnButtonCtrlComponent;
  let fixture: ComponentFixture<RnButtonCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnButtonCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnButtonCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
