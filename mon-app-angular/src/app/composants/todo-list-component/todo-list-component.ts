import { DatePipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo-service';
import { CreateUpdateTodoComponent } from "../create-update-todo-component/create-update-todo-component";

@Component({
  selector: 'app-todo-list-component',
  imports: [DatePipe, FormsModule, CreateUpdateTodoComponent, MatButton, MatCheckbox],
  templateUrl: './todo-list-component.html',
  styleUrl: './todo-list-component.css',
})
export class TodoListComponent {
  private readonly todoService = inject(TodoService);

  todoList: Signal<Todo[]> = this.todoService.getTodoList();

  todosTermines = this.todoService.todosTermines;
  nombreTodos = this.todoService.nombreTodos;

  supprimerTodo(todo: Todo): void {
    this.todoService.supprimerTodo(todo);
  }

  modifierTodo(todo: Todo): void {
    this.todoService.modifierTodo(todo);
  }
}
