import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCardsViewComponent } from './rn-cards-view.component';

describe('RnCardsViewComponent', () => {
  let component: RnCardsViewComponent;
  let fixture: ComponentFixture<RnCardsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCardsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCardsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
