import { Component, computed, effect, inject, input, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { Todo } from '../../models/todo';

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

  estEnModification = computed(() => {
    if (this.todo()) {
      return true;
    }

    return false;
  })

  titre = '';

  todo: Signal<Todo | undefined> = computed(() => {
    if (this.id()) {
      return this.todoService.getTodoById(parseInt(this.id() ?? ''));
    }

    return undefined;
  })

  constructor() {
    effect(() => {
      const t: Todo | undefined = this.todo();
      if (t) {
        this.titre = t.titre;
      }
    })
  }

  ajouterTodo(): void {
    if (this.estEnModification()) {
      const todo = this.todo() as Todo;
      todo.titre = this.titre;
      this.todoService.modifierTodo(todo);
    }
    else {
      this.todoService.ajouterTodo(this.titre);
    }

    this.router.navigate(['/todo-list']);
  }
}
