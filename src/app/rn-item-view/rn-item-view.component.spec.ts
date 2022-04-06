import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnItemViewComponent } from './rn-item-view.component';

describe('RnItemViewComponent', () => {
  let component: RnItemViewComponent;
  let fixture: ComponentFixture<RnItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnItemViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
