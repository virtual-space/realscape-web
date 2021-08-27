import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppViewHeaderComponent } from './app-view-header.component';

describe('AppViewHeaderComponent', () => {
  let component: AppViewHeaderComponent;
  let fixture: ComponentFixture<AppViewHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppViewHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
