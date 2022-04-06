import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnPropertiesViewComponent } from './rn-properties-view.component';

describe('RnPropertiesViewComponent', () => {
  let component: RnPropertiesViewComponent;
  let fixture: ComponentFixture<RnPropertiesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnPropertiesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnPropertiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
