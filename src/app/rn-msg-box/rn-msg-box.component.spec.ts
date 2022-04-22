import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnMsgBoxComponent } from './rn-msg-box.component';

describe('RnMsgBoxComponent', () => {
  let component: RnMsgBoxComponent;
  let fixture: ComponentFixture<RnMsgBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnMsgBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnMsgBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
