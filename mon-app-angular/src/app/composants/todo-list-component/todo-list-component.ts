import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo-service';
import { Todo } from '../../models/todo';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateUpdateTodoComponent } from "../create-update-todo-component/create-update-todo-component";

@Component({
  selector: 'app-todo-list-component',
  imports: [DatePipe, FormsModule, CreateUpdateTodoComponent],
  templateUrl: './todo-list-component.html',
  styleUrl: './todo-list-component.css',
})
export class TodoListComponent {
  private readonly todoService = inject(TodoService);

  todoList: Todo[] = this.todoService.getTodoList();
}
