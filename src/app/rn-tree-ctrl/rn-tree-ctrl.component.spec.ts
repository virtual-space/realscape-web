import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTreeCtrlComponent } from './rn-tree-ctrl.component';

describe('RnTreeCtrlComponent', () => {
  let component: RnTreeCtrlComponent;
  let fixture: ComponentFixture<RnTreeCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTreeCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTreeCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
