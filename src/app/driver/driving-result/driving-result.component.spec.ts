import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingResultComponent } from './driving-result.component';

describe('DrivingResultComponent', () => {
  let component: DrivingResultComponent;
  let fixture: ComponentFixture<DrivingResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivingResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
