import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnEditItemViewComponent } from './rn-edit-item-view.component';

describe('RnEditItemViewComponent', () => {
  let component: RnEditItemViewComponent;
  let fixture: ComponentFixture<RnEditItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnEditItemViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnEditItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
