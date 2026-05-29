import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _todos: WritableSignal<Todo[]> = signal([
    {
      dateCreation: new Date(),
      id: 1,
      termine: false,
      titre: 'Todo numéro 1'      
    } satisfies Todo
  ]);

  readonly todosTermines = computed(() => this._todos().filter(t => t.termine).length);
  readonly nombreTodos = computed(() => this._todos().length);

  constructor() {
    console.log('nouvelle instance')
  }
  getTodoList(): Signal<Todo[]> {
    return this._todos;
  }

  ajouterTodo(nom: string): void {
    const todosTries = this._todos().sort((a, b) => b.id - a.id);

    const todo: Todo = {
      dateCreation: new Date(),
      id: (todosTries.length > 0 ? todosTries[0].id : 0) + 1,
      termine: false,
      titre: nom
    };

    this._todos.update(current => [...current, todo]);
  }

  modifierTodo(todo: Todo): void {
    this._todos.update(value => [
      ...value.filter(v => v.id !== todo.id),
      todo
    ]);
  }

  supprimerTodo(todo: Todo): void {
    this._todos.update(value => value.filter(v => v.id !== todo.id));
  }
}
