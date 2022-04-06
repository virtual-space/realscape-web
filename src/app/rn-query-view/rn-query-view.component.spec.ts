import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnQueryViewComponent } from './rn-query-view.component';

describe('RnQueryViewComponent', () => {
  let component: RnQueryViewComponent;
  let fixture: ComponentFixture<RnQueryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnQueryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnQueryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
