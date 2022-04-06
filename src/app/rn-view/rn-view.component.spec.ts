import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnViewComponent } from './rn-view.component';

describe('RnViewComponent', () => {
  let component: RnViewComponent;
  let fixture: ComponentFixture<RnViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
