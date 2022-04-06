import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnListViewComponent } from './rn-list-view.component';

describe('RnListViewComponent', () => {
  let component: RnListViewComponent;
  let fixture: ComponentFixture<RnListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
