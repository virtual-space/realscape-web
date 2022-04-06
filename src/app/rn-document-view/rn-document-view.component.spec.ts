import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnDocumentViewComponent } from './rn-document-view.component';

describe('RnDocumentViewComponent', () => {
  let component: RnDocumentViewComponent;
  let fixture: ComponentFixture<RnDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnDocumentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
