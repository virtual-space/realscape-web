import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTagsCtrlComponent } from './rn-tags-ctrl.component';

describe('RnTagsCtrlComponent', () => {
  let component: RnTagsCtrlComponent;
  let fixture: ComponentFixture<RnTagsCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTagsCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTagsCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
