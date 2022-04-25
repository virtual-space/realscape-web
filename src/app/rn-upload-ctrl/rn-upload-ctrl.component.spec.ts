import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnUploadCtrlComponent } from './rn-upload-ctrl.component';

describe('RnUploadCtrlComponent', () => {
  let component: RnUploadCtrlComponent;
  let fixture: ComponentFixture<RnUploadCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnUploadCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnUploadCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
