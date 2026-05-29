import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Todo } from '../models/todo';
import { TodoApiService } from './todo-api-service';

const mockTodos: Todo[] = [{
  id: 14,
  dateCreation: new Date('2024-12-15'),
  termine: false,
  titre: 'Todo 14'
}];

describe('TodoApiService', () => {
  let service: TodoApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TodoApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load todos', () => {
    console.log('début du TU');
    
    service.getTodos().subscribe((todos: Todo[]) => {
      expect(todos).toBeDefined();
      expect(todos).toHaveLength(1);
      expect(todos[0].titre).toBe('Todo 14')    
    })

    httpController.expectOne('https://jsonplaceholder.typicode.com/todos').flush(mockTodos);

    console.log('fin du TU');
  })
});
