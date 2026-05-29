import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { TodoService } from '../../services/todo-service';
import { TodoListComponent } from './todo-list-component';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let service: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [TodoService, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    service = TestBed.inject(TodoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
