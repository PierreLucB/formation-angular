import { Component, signal } from '@angular/core';
import { TodoListComponent } from './composants/todo-list-component/todo-list-component';
import './models/utilisateur';

@Component({
  selector: 'app-root',
  imports: [TodoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mon-app-angular');


  constructor() {
  }
}
