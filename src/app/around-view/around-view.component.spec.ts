import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AroundViewComponent } from './around-view.component';

describe('AroundViewComponent', () => {
  let component: AroundViewComponent;
  let fixture: ComponentFixture<AroundViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AroundViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AroundViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
