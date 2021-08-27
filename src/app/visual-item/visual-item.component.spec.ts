import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisualItemComponent } from './visual-item.component';

describe('VisualItemComponent', () => {
  let component: VisualItemComponent;
  let fixture: ComponentFixture<VisualItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
