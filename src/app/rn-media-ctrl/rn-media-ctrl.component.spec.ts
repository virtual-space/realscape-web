import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnMediaCtrlComponent } from './rn-media-ctrl.component';

describe('RnMediaCtrlComponent', () => {
  let component: RnMediaCtrlComponent;
  let fixture: ComponentFixture<RnMediaCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnMediaCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnMediaCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
