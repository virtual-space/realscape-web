import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsViewComponent } from './apps-view.component';

describe('AppsViewComponent', () => {
  let component: AppsViewComponent;
  let fixture: ComponentFixture<AppsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
