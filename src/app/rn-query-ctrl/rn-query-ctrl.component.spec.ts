import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnQueryCtrlComponent } from './rn-query-ctrl.component';

describe('RnQueryCtrlComponent', () => {
  let component: RnQueryCtrlComponent;
  let fixture: ComponentFixture<RnQueryCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnQueryCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnQueryCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
