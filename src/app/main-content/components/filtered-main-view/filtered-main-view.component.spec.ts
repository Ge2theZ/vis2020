import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredMainViewComponent } from './filtered-main-view.component';

describe('FilteredMainViewComponent', () => {
  let component: FilteredMainViewComponent;
  let fixture: ComponentFixture<FilteredMainViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredMainViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
