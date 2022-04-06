import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnLabelViewComponent } from './rn-label-view.component';

describe('RnLabelViewComponent', () => {
  let component: RnLabelViewComponent;
  let fixture: ComponentFixture<RnLabelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnLabelViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnLabelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
