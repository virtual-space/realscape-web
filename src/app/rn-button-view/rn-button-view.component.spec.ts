import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnButtonViewComponent } from './rn-button-view.component';

describe('RnButtonViewComponent', () => {
  let component: RnButtonViewComponent;
  let fixture: ComponentFixture<RnButtonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnButtonViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnButtonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
