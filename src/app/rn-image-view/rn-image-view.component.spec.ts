import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnImageViewComponent } from './rn-image-view.component';

describe('RnImageViewComponent', () => {
  let component: RnImageViewComponent;
  let fixture: ComponentFixture<RnImageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnImageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnImageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
