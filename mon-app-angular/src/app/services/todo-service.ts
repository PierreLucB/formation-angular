import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _todos: Todo[] = [
    { id:1, dateCreation: new Date(), termine: true, titre : 'Tâche pour commencer'}
  ];

  getTodoList(): Todo[] {
    return this._todos;
  }

  ajouterTodo(nom: string): void {
    const todosTries = this._todos.sort((a, b) => a.id - b.id);

    const todo: Todo = {
      dateCreation: new Date(),
      id: (todosTries.length > 0 ? todosTries[0].id : 0) + 1,
      termine: false,
      titre: nom
    };

    this._todos.push(todo);
  }
}
