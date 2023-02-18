import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCodeViewComponent } from './rn-code-view.component';

describe('RnCodeViewComponent', () => {
  let component: RnCodeViewComponent;
  let fixture: ComponentFixture<RnCodeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCodeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
