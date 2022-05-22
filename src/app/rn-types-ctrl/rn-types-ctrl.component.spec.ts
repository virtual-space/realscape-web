import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTypesCtrlComponent } from './rn-types-ctrl.component';

describe('RnTypesCtrlComponent', () => {
  let component: RnTypesCtrlComponent;
  let fixture: ComponentFixture<RnTypesCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTypesCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTypesCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
