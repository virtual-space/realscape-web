import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnItemCtrlComponent } from './rn-item-ctrl.component';

describe('RnItemCtrlComponent', () => {
  let component: RnItemCtrlComponent;
  let fixture: ComponentFixture<RnItemCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnItemCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnItemCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
