import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDriverComponent } from './todo-driver.component';

describe('TodoDriverComponent', () => {
  let component: TodoDriverComponent;
  let fixture: ComponentFixture<TodoDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
