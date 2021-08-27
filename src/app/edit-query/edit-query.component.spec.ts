import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditQueryComponent } from './edit-query.component';

describe('EditQueryComponent', () => {
  let component: EditQueryComponent;
  let fixture: ComponentFixture<EditQueryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
