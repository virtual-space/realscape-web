import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnPanelViewComponent } from './rn-panel-view.component';

describe('RnPanelViewComponent', () => {
  let component: RnPanelViewComponent;
  let fixture: ComponentFixture<RnPanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnPanelViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
