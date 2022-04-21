import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnItemSelectCtrlComponent } from './rn-item-select-ctrl.component';

describe('RnItemSelectCtrlComponent', () => {
  let component: RnItemSelectCtrlComponent;
  let fixture: ComponentFixture<RnItemSelectCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnItemSelectCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnItemSelectCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
