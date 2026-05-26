import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTodoComponent } from './create-update-todo-component';

describe('CreateUpdateTodoComponent', () => {
  let component: CreateUpdateTodoComponent;
  let fixture: ComponentFixture<CreateUpdateTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateTodoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTodoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
