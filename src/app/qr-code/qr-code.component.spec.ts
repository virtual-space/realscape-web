import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QrCodeViewComponent } from './qr-code.component';

describe('QrCodeComponent', () => {
  let component: QrCodeViewComponent;
  let fixture: ComponentFixture<QrCodeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
