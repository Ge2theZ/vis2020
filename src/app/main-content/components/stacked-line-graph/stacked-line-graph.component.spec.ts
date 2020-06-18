import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLineGraphComponent } from './stacked-line-graph.component';

describe('StackedLineGraphComponent', () => {
  let component: StackedLineGraphComponent;
  let fixture: ComponentFixture<StackedLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedLineGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
