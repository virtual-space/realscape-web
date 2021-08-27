import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealScapeComponent } from './real-scape.component';

describe('RealScapeComponent', () => {
  let component: RealScapeComponent;
  let fixture: ComponentFixture<RealScapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealScapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealScapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
