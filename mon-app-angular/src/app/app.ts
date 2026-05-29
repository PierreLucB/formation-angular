import { Component, inject, signal } from '@angular/core';
import { from, map, Observable, of, take } from 'rxjs';
import './models/utilisateur';
import { RouterOutlet } from '@angular/router';
import { TodoApiService } from './services/todo-api-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mon-app-angular');

  toto$ = of('toto');

  todos = toSignal(inject(TodoApiService).getTodos());

  constructor() {
    console.log('todos=', this.todos());

    const data$: Observable<number> = from([1, 2, 3, 4, 5]);

    data$.subscribe(v => console.log("valeur reçue : " + v))


    const d$: Observable<number> = data$.pipe(
      map(x => x * 2),
      map(x => x / 4),
      take(2)
    );

    d$.subscribe(v => console.log("valeur reçue : " + v));

    const data2$: Observable<number[]> = of([1, 2, 3, 4, 5]);
    data2$.subscribe(v => console.log("Valeur 2 : " + v))

    const data3$: Observable<string> = from("chainedecaractere");
    data3$.subscribe(v => console.log("Charactére reçu : " + v))
  }
}
