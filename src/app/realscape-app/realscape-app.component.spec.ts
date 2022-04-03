import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealscapeAppComponent } from './realscape-app.component';

describe('RealscapeAppComponent', () => {
  let component: RealscapeAppComponent;
  let fixture: ComponentFixture<RealscapeAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealscapeAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealscapeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
