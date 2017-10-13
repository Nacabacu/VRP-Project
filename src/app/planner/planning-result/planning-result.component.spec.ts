import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningResultComponent } from './planning-result.component';

describe('PlanningResultComponent', () => {
  let component: PlanningResultComponent;
  let fixture: ComponentFixture<PlanningResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
