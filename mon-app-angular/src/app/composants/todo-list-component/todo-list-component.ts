import { Component, effect, inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from "@angular/router";
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo';
import { MaxLengthPipe } from "../../pipes/max-length-pipe";
import { TodoService } from '../../services/todo-service';

@Component({
  selector: 'app-todo-list-component',
  imports: [FormsModule, MatButton, MatCheckbox, MatTableModule, MaxLengthPipe, RouterLink],
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
