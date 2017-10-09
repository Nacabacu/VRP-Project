import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepotComponent } from './create-depot.component';

describe('CreateDepotComponent', () => {
  let component: CreateDepotComponent;
  let fixture: ComponentFixture<CreateDepotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDepotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
