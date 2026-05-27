import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-update-todo-component',
  imports: [FormsModule],
  templateUrl: './create-update-todo-component.html',
  styleUrl: './create-update-todo-component.css',
})
export class CreateUpdateTodoComponent {
  private readonly todoService = inject(TodoService);
  
  nouveauTodo: string = '';

  ajouterTodo(): void {
    this.todoService.ajouterTodo(this.nouveauTodo);

    this.nouveauTodo = '';
  }
}
