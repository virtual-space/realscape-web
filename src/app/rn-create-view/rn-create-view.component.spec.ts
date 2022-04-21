import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnCreateViewComponent } from './rn-create-view.component';

describe('RnCreateViewComponent', () => {
  let component: RnCreateViewComponent;
  let fixture: ComponentFixture<RnCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnCreateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
