import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnDialogComponent } from './rn-dialog.component';

describe('RnDialogComponent', () => {
  let component: RnDialogComponent;
  let fixture: ComponentFixture<RnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
