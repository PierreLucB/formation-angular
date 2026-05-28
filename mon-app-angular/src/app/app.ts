import { Component, signal } from '@angular/core';
import { from, map, Observable, of, take } from 'rxjs';
import './models/utilisateur';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mon-app-angular');

  toto$ = of('toto');

  constructor() {
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
