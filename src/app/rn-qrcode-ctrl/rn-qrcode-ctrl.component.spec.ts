import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnQrcodeCtrlComponent } from './rn-qrcode-ctrl.component';

describe('RnQrcodeCtrlComponent', () => {
  let component: RnQrcodeCtrlComponent;
  let fixture: ComponentFixture<RnQrcodeCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnQrcodeCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnQrcodeCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
