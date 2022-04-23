import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCardViewComponent } from './rn-card-view.component';

describe('RnCardViewComponent', () => {
  let component: RnCardViewComponent;
  let fixture: ComponentFixture<RnCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
