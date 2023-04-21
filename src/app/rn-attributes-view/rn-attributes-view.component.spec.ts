import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnAttributesViewComponent } from './rn-attributes-view.component';

describe('RnAttributesViewComponent', () => {
  let component: RnAttributesViewComponent;
  let fixture: ComponentFixture<RnAttributesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnAttributesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnAttributesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
