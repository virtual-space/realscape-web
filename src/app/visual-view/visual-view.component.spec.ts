import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualViewComponent } from './visual-view.component';

describe('VisualViewComponent', () => {
  let component: VisualViewComponent;
  let fixture: ComponentFixture<VisualViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
