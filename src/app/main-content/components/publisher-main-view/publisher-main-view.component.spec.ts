import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherMainViewComponent } from './publisher-main-view.component';

describe('PublisherMainViewComponent', () => {
  let component: PublisherMainViewComponent;
  let fixture: ComponentFixture<PublisherMainViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublisherMainViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
