import { Component, effect, inject, input, output, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TodoService } from '../../services/todo-service';
import { MatInput, MatFormField, MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-update-todo-component',
  imports: [FormsModule, MatButton, MatInput, MatFormField, MatLabel],
  templateUrl: './create-update-todo-component.html',
  styleUrl: './create-update-todo-component.css'
})
export class CreateUpdateTodoComponent {
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);

  id = input<string>();

  constructor() {
    effect(() => console.log('id=', this.id()))
  }

  nouveauTodo: string = '';

  ajouterTodo(): void {
    this.todoService.ajouterTodo(this.nouveauTodo);

    this.router.navigate(['/todo-list']);
  }
}
