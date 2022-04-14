import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCtrlViewComponent } from './rn-ctrl-view.component';

describe('RnCtrlViewComponent', () => {
  let component: RnCtrlViewComponent;
  let fixture: ComponentFixture<RnCtrlViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCtrlViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCtrlViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
