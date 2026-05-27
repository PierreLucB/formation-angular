import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
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

  cpt = signal(10);

  messageDerive: Signal<string> = computed(() => {
    const c: number = this.cpt();

    if (c > 30) {
      return 'Il fait chaud';
    }

    if (c > 20) {
      return "On est bien"
    }

    return "Il fait froid"
  })

  incrementer(): void {
    this.cpt.update(currentValue => ++currentValue);
  }

  reset(): void {
    this.cpt.set(0);
  }
}
