import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnAttrsCtrlComponent } from './rn-attrs-ctrl.component';

describe('RnAttrsCtrlComponent', () => {
  let component: RnAttrsCtrlComponent;
  let fixture: ComponentFixture<RnAttrsCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnAttrsCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnAttrsCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
