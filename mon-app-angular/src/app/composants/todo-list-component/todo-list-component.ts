import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, effect, inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo-service';
import { CreateUpdateTodoComponent } from "../create-update-todo-component/create-update-todo-component";

@Component({
  selector: 'app-todo-list-component',
  imports: [DatePipe, FormsModule, CreateUpdateTodoComponent, MatButton, MatCheckbox, AsyncPipe, JsonPipe],
  templateUrl: './todo-list-component.html',
  styleUrl: './todo-list-component.css'
})
export class TodoListComponent {
  private readonly todoService = inject(TodoService);

  todoList: Signal<Todo[]> = this.todoService.getTodoList();
  todoList$: Observable<Todo[]> = toObservable(this.todoList);
  todoList2: Signal<Todo[] | undefined> = toSignal(this.todoList$);


  todosTermines = this.todoService.todosTermines;
  nombreTodos = this.todoService.nombreTodos;

  constructor() {
    effect(() => {
      console.log('Nouvelle émission de signal reçue.', this.todoList(), this.todosTermines(), this.nombreTodos());


    })
  }

  supprimerTodo(todo: Todo): void {
    this.todoService.supprimerTodo(todo);
  }

  modifierTodo(todo: Todo): void {
    this.todoService.modifierTodo(todo);
  }
}
