import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnTreeViewComponent } from './rn-tree-view.component';

describe('RnTreeViewComponent', () => {
  let component: RnTreeViewComponent;
  let fixture: ComponentFixture<RnTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
