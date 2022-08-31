import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnFormViewComponent } from './rn-form-view.component';

describe('RnFormViewComponent', () => {
  let component: RnFormViewComponent;
  let fixture: ComponentFixture<RnFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnFormViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
