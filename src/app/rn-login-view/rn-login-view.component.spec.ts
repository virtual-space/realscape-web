import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnLoginViewComponent } from './rn-login-view.component';

describe('RnLoginViewComponent', () => {
  let component: RnLoginViewComponent;
  let fixture: ComponentFixture<RnLoginViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnLoginViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnLoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
