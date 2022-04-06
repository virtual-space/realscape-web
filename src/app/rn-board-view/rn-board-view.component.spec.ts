import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnBoardViewComponent } from './rn-board-view.component';

describe('RnBoardViewComponent', () => {
  let component: RnBoardViewComponent;
  let fixture: ComponentFixture<RnBoardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnBoardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnBoardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
