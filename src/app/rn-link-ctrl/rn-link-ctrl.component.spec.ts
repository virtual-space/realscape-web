import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnLinkCtrlComponent } from './rn-link-ctrl.component';

describe('RnLinkCtrlComponent', () => {
  let component: RnLinkCtrlComponent;
  let fixture: ComponentFixture<RnLinkCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnLinkCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnLinkCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
