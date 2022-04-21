import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCreateItemViewComponent } from './rn-create-item-view.component';

describe('RnCreateItemViewComponent', () => {
  let component: RnCreateItemViewComponent;
  let fixture: ComponentFixture<RnCreateItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCreateItemViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCreateItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
