import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnVideoViewComponent } from './rn-video-view.component';

describe('RnVideoViewComponent', () => {
  let component: RnVideoViewComponent;
  let fixture: ComponentFixture<RnVideoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnVideoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnVideoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
