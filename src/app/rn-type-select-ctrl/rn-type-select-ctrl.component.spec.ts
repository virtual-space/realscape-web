import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTypeSelectCtrlComponent } from './rn-type-select-ctrl.component';

describe('RnTypeSelectCtrlComponent', () => {
  let component: RnTypeSelectCtrlComponent;
  let fixture: ComponentFixture<RnTypeSelectCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTypeSelectCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTypeSelectCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
