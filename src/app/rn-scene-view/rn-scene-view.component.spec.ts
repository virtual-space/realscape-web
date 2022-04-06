import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnSceneViewComponent } from './rn-scene-view.component';

describe('RnSceneViewComponent', () => {
  let component: RnSceneViewComponent;
  let fixture: ComponentFixture<RnSceneViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnSceneViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnSceneViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
