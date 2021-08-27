import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViewHeaderComponent } from './app-view-header.component';

describe('AppViewHeaderComponent', () => {
  let component: AppViewHeaderComponent;
  let fixture: ComponentFixture<AppViewHeaderComponent>;

  beforeEach(async(() => {
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
