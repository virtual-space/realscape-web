import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeViewComponent } from './qr-code.component';

describe('QrCodeComponent', () => {
  let component: QrCodeViewComponent;
  let fixture: ComponentFixture<QrCodeViewComponent>;

  beforeEach(async(() => {
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
