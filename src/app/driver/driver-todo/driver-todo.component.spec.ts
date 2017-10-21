import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTodoComponent } from './driver-todo.component';

describe('DriverTodoComponent', () => {
  let component: DriverTodoComponent;
  let fixture: ComponentFixture<DriverTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
