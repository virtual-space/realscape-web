import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnPageViewComponent } from './rn-page-view.component';

describe('RnPageViewComponent', () => {
  let component: RnPageViewComponent;
  let fixture: ComponentFixture<RnPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnPageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
