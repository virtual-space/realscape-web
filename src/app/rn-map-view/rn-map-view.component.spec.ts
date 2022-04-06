import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnMapViewComponent } from './rn-map-view.component';

describe('RnMapViewComponent', () => {
  let component: RnMapViewComponent;
  let fixture: ComponentFixture<RnMapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnMapViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
