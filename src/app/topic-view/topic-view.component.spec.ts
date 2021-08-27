import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopicViewComponent } from './topic-view.component';

describe('TopicViewComponent', () => {
  let component: TopicViewComponent;
  let fixture: ComponentFixture<TopicViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
