# Formation Angular 20 - Jour 2
## Programme Complet : Réactivité & Composants Avancés

---

## PARTIE 1 : LA PROGRAMMATION RÉACTIVE (9h00-12h30)

### SLIDE 1 : Accueil et Récapitulatif Jour 1

**Contenu à présenter :**

Bienvenue au Jour 2 ! Hier, nous avons posé les fondations. Aujourd'hui, nous explorons la puissance réactive d'Angular.

**Récapitulatif rapide Jour 1 :**
- Classes et modules JavaScript/TypeScript
- Data binding et composants
- Control flow et directives
- Création d'une Todo List

**Aujourd'hui :**
- Maîtriser la programmation réactive (RxJS)
- Découvrir les Signals (nouvelle API)
- Services avancés et communication
- Reactive Forms et validations
- Cycle de vie des composants

**Objectif :** Passer d'une application statique à une application réactive et responsive.

---

### SLIDE 2 : Principes de la Programmation Réactive

**Concepts théoriques à présenter :**

La programmation réactive est un paradigme basé sur des flux de données et la propagation automatique des changements.

**Principes fondamentaux :**

1. **Déclaratif vs Impératif :**

```typescript
// Impératif (ancien style)
let a = 5;
let b = 10;
let c = a + b; // c = 15

a = 20;
console.log(c); // c = 15 (pas mis à jour !)

// Déclaratif (réactif) - Exemple avec Signals
const a = signal(5);
const b = signal(10);
const c = computed(() => a() + b()); // c se met à jour automatiquement

console.log(c()); // 15
a.set(20);
console.log(c()); // 30 (mis à jour automatiquement !)
```

2. **Réaction en chaîne :**

Quand une source change → tous les dépendants sont notifiés → changements propagés automatiquement.

```typescript
// Exemple avec Signals
const prenom = signal('Jean');
const nom = signal('Dupont');
const nomComplet = computed(() => `${prenom()} ${nom()}`);
const salutation = computed(() => `Bonjour, ${nomComplet()} !`);

console.log(salutation()); // "Bonjour, Jean Dupont !"
prenom.set('Marie');
console.log(salutation()); // "Bonjour, Marie Dupont !" (mis à jour automatiquement)
```

**Avantages :**
- Code plus prévisible
- Moins d'erreurs d'état manqué
- Meilleure réactivité UI
- Gestion naturelle de l'asynchrone

---

### SLIDE 3 : Observables RxJS - Concepts Fondamentaux

**Concepts théoriques :**

Un Observable est un flux de données qu'on peut observer et transformer.

```typescript
// Observable simple
import { Observable } from 'rxjs';

const observable = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

// Pour utiliser : il faut s'y abonner (subscribe)
observable.subscribe({
  next: (value) => console.log(value),     // Chaque valeur
  error: (err) => console.error(err),      // Si erreur
  complete: () => console.log('Terminé')   // Quand fini
});

// Affiche :
// 1
// 2
// 3
// Terminé
```

**Observables vs Promesses :**

```typescript
// Promesse : une seule valeur
const promesse = new Promise(resolve => {
  resolve('Valeur');
});

// Observable : plusieurs valeurs dans le temps
const observable = new Observable(observer => {
  observer.next('Valeur 1');
  setTimeout(() => observer.next('Valeur 2'), 1000);
  setTimeout(() => observer.next('Valeur 3'), 2000);
});
```

**Types d'Observables :**

- **Cold Observable :** Commence à émettre uniquement quand on s'abonne. Chaque souscription reçoit des valeurs indépendantes.
- **Hot Observable :** Émet des valeurs indépendamment des souscriptions. Les souscripteurs reçoivent les valeurs à partir du moment où ils s'abonnent.

```typescript
// Cold Observable (démarre à la souscription)
const cold$ = new Observable(observer => {
  const randomValue = Math.random();
  observer.next(randomValue);
  observer.complete();
});

cold$.subscribe(val => console.log('Sub 1:', val)); // 0.456
cold$.subscribe(val => console.log('Sub 2:', val)); // 0.789 (valeur différente!)

// Hot Observable (valeurs partagées)
import { Subject } from 'rxjs';

const hot$ = new Subject();

hot$.subscribe(val => console.log('Sub 1:', val));
hot$.subscribe(val => console.log('Sub 2:', val));

hot$.next(1); // Les deux affichent 1

// Explication :
// Cold = chaque abonné obtient son propre flux (ex: requête HTTP)
// Hot = tous les abonnés partagent le même flux (ex: événements DOM)
```

---

### SLIDE 4 : Opérateurs RxJS Essentiels

**Concepts théoriques :**

Les opérateurs transforment et filtrent les flux.

```typescript
import { from, interval } from 'rxjs';
import { map, filter, take, debounceTime, switchMap } from 'rxjs/operators';

// Observable source : [1, 2, 3, 4, 5]
const source = from([1, 2, 3, 4, 5]);

// map : Transformer chaque valeur
source.pipe(
  map(x => x * 2)
).subscribe(console.log); // 2, 4, 6, 8, 10

// filter : Garder seulement certaines valeurs
source.pipe(
  filter(x => x > 2)
).subscribe(console.log); // 3, 4, 5

// take : Prendre N valeurs
source.pipe(
  take(3)
).subscribe(console.log); // 1, 2, 3

// Combiner plusieurs opérateurs (pipe)
source.pipe(
  filter(x => x > 2),
  map(x => x * 10),
  take(2)
).subscribe(console.log); // 30, 40
```

**Opérateurs courants :**

```typescript
// debounceTime : Attendre avant d'émettre
const search = input$.pipe(
  debounceTime(300) // Attend 300ms d'inactivité
);

// switchMap : Passer à un nouvel observable
clickEvent$.pipe(
  switchMap(() => http.get('/api/data'))
);

// merge : Combiner plusieurs observables
merge(observable1, observable2);

// combineLatest : Combine les dernières valeurs
combineLatest([observable1, observable2]).pipe(
  map(([val1, val2]) => val1 + val2)
);

// startWith : Émettre une valeur initiale
source$.pipe(
  startWith(0) // Commence par 0
);
```

---

### SLIDE 5 : Souscriptions et Gestion de l'Asynchronisme

**Concepts théoriques :**

Les souscriptions doivent être bien gérées pour éviter les fuites mémoire.

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<p>{{ donnees }}</p>`
})
export class DemoComponent implements OnInit, OnDestroy {
  donnees: any;
  private souscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();

  constructor(private monService: MonService) { }

  ngOnInit() {
    // Méthode 1 : Gérer manuellement avec array
    const sub = this.monService.getDonnees().subscribe(
      (data) => {
        this.donnees = data;
      }
    );
    this.souscriptions.push(sub);

    // Méthode 2 : Subject de désabonnement
    this.monService.getDonnees().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.donnees = data;
    });
  }

  ngOnDestroy() {
    // Libérer les ressources
    this.souscriptions.forEach(sub => sub.unsubscribe());
    this.destroy$.next(); // déclenche tous les takeUntil
    this.destroy$.complete(); // bonne pratique - nettoie
  }
}
```

**Meilleure pratique moderne : Async Pipe :**

```typescript
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <!-- Async pipe gère tout automatiquement ! -->
    <p>{{ donnees$ | async }}</p>
  `
})
export class DemoComponent {
  donnees$ = this.monService.getDonnees();

  constructor(private monService: MonService) { }
}
```

L'async pipe :
- S'abonne automatiquement
- Se désabonne quand le composant est détruit
- Pas de memory leak !

---

### SLIDE 6 : Mode Zoneless et Détection de Changements

**Concepts théoriques :**

Angular 17+ permet d'exécuter sans Zone.js pour plus de performance.

**Traditionnel (avec Zone.js) :**

```typescript
// main.ts
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
```

Zone.js intercepte TOUS les événements asynchrones (timers, événements DOM, etc.) pour détecter les changements.

**Mode Zoneless (Angular 17+) :**

```typescript
// angular.json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "polyfills": [
              // "zone.js" // Commenté pour désactiver zone.js
            ]
          }
        }
      }
    }
  }
}

// main.ts
// Pas besoin d'importer zone.js !
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
});
```

**Avantages du mode Zoneless :**
- Performances +30% à +50%
- Code plus prévisible
- Meilleure gestion mémoire
- Corrige les bugs Zone.js

**Changement pour le développeur :**

Angular détecte les changements uniquement via :
- Signals
- Async pipe
- Événements DOM (click, etc.)

```typescript
// AVANT (Zone.js détecte tout)
timer = setInterval(() => {
  this.count++;
}, 1000);

// APRÈS (Zoneless - pas de détection automatique)
count = signal(0);
timer = setInterval(() => {
  this.count.set(this.count() + 1); // Signal déclenche la détection
}, 1000);
```

---

### SLIDE 7 : Les Signals - Nouvelle API Angular

**Concepts théoriques :**

Les Signals sont la nouvelle façon moderne de gérer la réactivité en Angular (depuis v16).

**Syntaxe de base :**

```typescript
import { signal, computed, effect } from '@angular/core';

// Créer un signal
const count = signal(0);

// Lire la valeur (appeler comme fonction)
console.log(count()); // 0

// Modifier la valeur
count.set(5);           // Définir à 5
count.update(v => v + 1); // Incrémenter

// Signal dérivé (computed)
const double = computed(() => count() * 2);
console.log(double()); // 10

// Effet de bord (effect)
effect(() => {
  console.log('Count changed:', count());
});
```

**Pourquoi utiliser des Signals ?**

```typescript
// AVANT : Avec observables (asynchrone)
count$ = new BehaviorSubject(0);
double$ = this.count$.pipe(map(v => v * 2));

// APRÈS : Avec signals (synchrone)
count = signal(0);
double = computed(() => this.count() * 2);
```

Avantages :
- Plus simple et direct
- Synchrone (pas besoin de subscribe)
- Performances optimales
- Détection de changements automatique

**Exemple en composant :**

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ double() }}</p>
    <button (click)="incrementer()">+1</button>
  `
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  incrementer() {
    this.count.update(v => v + 1);
  }
}
```

---

### SLIDE 8 : Signals Avancés

**Concepts théoriques :**

**1. WritableSignal vs Signal :**

```typescript
import { signal, computed, Signal, WritableSignal } from '@angular/core';

// WritableSignal : peut être modifié
const count: WritableSignal<number> = signal(0);
count.set(5);

// Signal (readonly) : seulement lecture
const double: Signal<number> = computed(() => count() * 2);
// double.set(10); // ❌ ERREUR : computed est readonly
```

**2. Effects (Effets de bord) :**

```typescript
import { effect } from '@angular/core';

// Effect s'exécute quand ses dépendances changent
effect(() => {
  console.log('Count changed:', this.count());
  // Peut faire des actions asynchrones
  localStorage.setItem('count', this.count().toString());
});

// Effect avec nettoyage
effect((onCleanup) => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  onCleanup(() => clearInterval(timer));
});
```

**3. Computed avancés :**

```typescript
// Computed avec plusieurs dépendances
const prenom = signal('Jean');
const nom = signal('Dupont');
const age = signal(30);

const presentation = computed(() => 
  `${this.prenom()} ${this.nom()}, ${this.age()} ans`
);

// Computed imbriqués
const nomComplet = computed(() => `${prenom()} ${nom()}`);
const salutation = computed(() => `Bonjour, ${nomComplet()} !`);
```

**4. Conversion Signal ↔ Observable :**

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

// Observable → Signal
const time$ = interval(1000);
const timeSignal = toSignal(time$, { initialValue: 0 });

// Signal → Observable
const count = signal(0);
const count$ = toObservable(count);

count$.subscribe(val => console.log('Changed:', val));
```

---

### SLIDE 9 : Services et Injection de Dépendances

**Concepts théoriques :**

Les services centralisent la logique métier et les données.

**Créer un service :**

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root' // Service singleton global
})
export class CounterService {
  // État privé
  private count = signal(0);

  // Exposer en readonly
  readonly countValue = this.count.asReadonly();

  // Computed
  readonly double = computed(() => this.count() * 2);

  incrementer() {
    this.count.update(v => v + 1);
  }

  decrementer() {
    this.count.update(v => v - 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

**Utiliser le service :**

```typescript
import { Component } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ counterService.countValue() }}</p>
    <p>Double: {{ counterService.double() }}</p>
    <button (click)="counterService.incrementer()">+1</button>
    <button (click)="counterService.decrementer()">-1</button>
    <button (click)="counterService.reset()">Reset</button>
  `
})
export class CounterComponent {
  constructor(public counterService: CounterService) { }
}
```

---

### SLIDE 10 : Hiérarchie des Injecteurs

**Concepts théoriques :**

Angular a une hiérarchie d'injecteurs pour gérer la portée des services.

```
┌─────────────────────────────┐
│   APPLICATION ROOT          │ ← providedIn: 'root' (singleton global)
│   (Injecteur Racine)        │
└─────────────┬───────────────┘
              │
     ┌────────┴────────┐
     │                 │
┌────▼─────┐      ┌───▼──────┐
│ Module A │      │ Module B │ ← providedIn: ModuleA (par module)
└────┬─────┘      └───┬──────┘
     │                │
┌────▼─────┐      ┌───▼──────┐
│  Comp 1  │      │  Comp 2  │ ← providers: [...] (par composant)
└──────────┘      └──────────┘
```

**Différentes portées :**

```typescript
// 1. Service global (singleton)
@Injectable({
  providedIn: 'root'
})
export class GlobalService { }

// 2. Service par composant (nouvelle instance)
@Component({
  selector: 'app-demo',
  standalone: true,
  providers: [LocalService] // Nouvelle instance pour ce composant
})
export class DemoComponent { }

// 3. Service avec standalone components
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    MyService // Fourni au niveau application
  ]
});
```

**Règle de résolution :**

Angular cherche le service du bas vers le haut :
1. Composant actuel
2. Composant parent
3. Module
4. Root

```typescript
@Component({
  selector: 'app-parent',
  providers: [DataService] // Instance A
})
export class ParentComponent { }

@Component({
  selector: 'app-enfant',
  providers: [DataService] // Instance B (différente!)
})
export class EnfantComponent {
  constructor(private service: DataService) {
    // Utilise l'instance B locale
  }
}
```

---

### SLIDE 11 : Communication entre Composants

**Concepts théoriques :**

Plusieurs façons de faire communiquer des composants.

**1. Parent → Enfant (Input) :**

```typescript
// Enfant
@Component({
  selector: 'app-enfant',
  standalone: true,
  template: `<p>Message: {{ message }}</p>`
})
export class EnfantComponent {
  @Input() message!: string;
}

// Parent
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [EnfantComponent],
  template: `<app-enfant [message]="texte"></app-enfant>`
})
export class ParentComponent {
  texte = 'Bonjour depuis le parent';
}
```

**2. Enfant → Parent (Output) :**

```typescript
// Enfant
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-enfant',
  standalone: true,
  template: `<button (click)="envoyer()">Envoyer</button>`
})
export class EnfantComponent {
  @Output() message = new EventEmitter<string>();

  envoyer() {
    this.message.emit('Salut du enfant !');
  }
}

// Parent
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [EnfantComponent],
  template: `
    <app-enfant (message)="recevoirMessage($event)"></app-enfant>
    <p>{{ messageRecu }}</p>
  `
})
export class ParentComponent {
  messageRecu = '';

  recevoirMessage(msg: string) {
    this.messageRecu = msg;
  }
}
```

**3. Via un Service (frères/éloignés) :**

```typescript
// Service partagé
@Injectable({ providedIn: 'root' })
export class MessageService {
  private messageSubject = new Subject<string>();
  message$ = this.messageSubject.asObservable();

  envoyer(msg: string) {
    this.messageSubject.next(msg);
  }
}

// Composant émetteur
export class ComposantA {
  constructor(private messageService: MessageService) { }

  envoyer() {
    this.messageService.envoyer('Message de A');
  }
}

// Composant récepteur
export class ComposantB implements OnInit {
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.message$.subscribe(msg => {
      console.log('Reçu:', msg);
    });
  }
}
```

---

### SLIDE 12 : Input et Output Signals (Angular 17+)

**Concepts théoriques :**

Nouvelle API moderne pour les inputs/outputs avec signals.

**Input Signals :**

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-enfant',
  standalone: true,
  template: `
    <p>Nom: {{ nom() }}</p>
    <p>Age: {{ age() }}</p>
    <p>Majeur: {{ estMajeur() }}</p>
  `
})
export class EnfantComponent {
  // Input signal
  nom = input.required<string>();
  age = input(0);

  // Computed basé sur input
  estMajeur = computed(() => this.age() >= 18);
}

// Parent
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [EnfantComponent],
  template: `
    <app-enfant [nom]="'Jean'" [age]="25"></app-enfant>
  `
})
export class ParentComponent { }
```

**Output Signals :**

```typescript
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-bouton',
  standalone: true,
  template: `
    <button (click)="handleClick()">Cliquer</button>
  `
})
export class BoutonComponent {
  // Output signal
  clicked = output<string>();

  handleClick() {
    this.clicked.emit('Bouton cliqué !');
  }
}

// Parent
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [BoutonComponent],
  template: `
    <app-bouton (clicked)="onClicked($event)"></app-bouton>
    <p>{{ message }}</p>
  `
})
export class ParentComponent {
  message = '';

  onClicked(msg: string) {
    this.message = msg;
  }
}
```

---

### SLIDE 13 : Cycle de Vie des Composants

**Concepts théoriques :**

Angular appelle des hooks (crochets) à différents moments de vie d'un composant.
```
CRÉATION → OnInit → OnChanges → DoCheck → AfterViewInit → DESTRUCTION → OnDestroy
```
```typescript
import { 
  Component, 
  OnInit, 
  OnDestroy, 
  OnChanges,
  DoCheck,
  AfterViewInit,
  SimpleChanges,
  Input 
} from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  template: `<p>{{ data }}</p>`
})
export class LifecycleComponent implements OnInit, OnChanges, DoCheck, AfterViewInit, OnDestroy {
  @Input() data!: string;

  constructor() {
    console.log('1. Constructor appelé');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('2. OnChanges - Input changed', changes);
  }

  ngOnInit() {
    console.log('3. OnInit - Composant initialisé');
    // Idéal pour : souscriptions, appels API
  }

  ngDoCheck() {
    console.log('4. DoCheck - Détection de changements manuelle');
    // ⚠️ Appelé très souvent ! Utilisé avec prudence
    // Idéal pour : détecter des changements qu'Angular ne voit pas
  }

  ngAfterViewInit() {
    console.log('5. AfterViewInit - Vue initialisée');
    // Idéal pour : manipulation DOM
  }

  ngOnDestroy() {
    console.log('6. OnDestroy - Composant détruit');
    // Idéal pour : nettoyage, unsubscribe
  }
}
```

**Quand utiliser chaque hook :**

| Hook | Usage |
|------|-------|
| `constructor()` | Injection de dépendances uniquement |
| `ngOnInit()` | Initialisations, appels API, souscriptions |
| `ngOnChanges()` | Réagir aux changements d'@Input |
| `ngDoCheck()` | Détection manuelle de changements (⚠️ performances) |
| `ngAfterViewInit()` | Accéder aux éléments du DOM |
| `ngOnDestroy()` | Nettoyage, unsubscribe, clearInterval |

**⚠️ Attention avec `ngDoCheck()` :**
- Appelé à **chaque cycle de détection** (très fréquent)
- Peut impacter les performances si mal utilisé
- Utile pour détecter des changements dans des objets/tableaux mutés

---

### SLIDE 14 : ViewChild et ContentChild

**Concepts théoriques :**

Accéder aux éléments enfants et au contenu projeté.

**ViewChild : Accéder aux enfants du template :**

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <input #monInput type="text" />
    <button (click)="focusInput()">Focus</button>
  `
})
export class DemoComponent implements AfterViewInit {
  @ViewChild('monInput') inputRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // Accéder à l'élément
    console.log(this.inputRef.nativeElement.value);
  }

  focusInput() {
    this.inputRef.nativeElement.focus();
  }
}
```

**Version Signal (Angular 17+) :**

```typescript
import { Component, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <input #monInput type="text" />
    <button (click)="focusInput()">Focus</button>
  `
})
export class DemoComponent {
  inputRef = viewChild<ElementRef<HTMLInputElement>>('monInput');

  focusInput() {
    this.inputRef()?.nativeElement.focus();
  }
}
```

**ContentChild : Accéder au contenu projeté :**

```typescript
// Composant enfant
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent implements AfterContentInit {
  @ContentChild('header') headerRef!: ElementRef;

  ngAfterContentInit() {
    console.log('Header:', this.headerRef);
  }
}

// Utilisation
@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card>
      <h1 #header>Titre</h1>
      <p>Contenu</p>
    </app-card>
  `
})
export class ParentComponent { }
```

---

## PARTIE 2 : FORMULAIRES RÉACTIFS (13h30-15h15)

### SLIDE 15 : Introduction aux Formulaires Réactifs

**Concepts théoriques :**

Les formulaires réactifs sont construits en TypeScript et observables via RxJS.

**Comparaison Template-Driven vs Reactive :**

```typescript
// ❌ Template-Driven (ancien, moins recommandé)
<input [(ngModel)]="nom" required />

// ✅ Reactive Forms (moderne, recommandé)
<input [formControl]="nomControl" />
```

**Avantages Reactive Forms :**
- Plus testable
- Plus prévisible
- Validation complexe facile
- Observable (valueChanges, statusChanges)
- TypeScript fort

**Structure de base :**

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formulaire" (ngSubmit)="onSubmit()">
      <input formControlName="nom" placeholder="Nom" />
      <input formControlName="email" placeholder="Email" />
      <button type="submit">Envoyer</button>
    </form>
  `
})
export class FormComponent {
  formulaire = new FormGroup({
    nom: new FormControl(''),
    email: new FormControl('')
  });

  onSubmit() {
    console.log(this.formulaire.value);
  }
}
```

---

### SLIDE 16 : FormControl et Validation

**Concepts théoriques :**

**FormControl avec validateurs :**

```typescript
import { FormControl, Validators } from '@angular/forms';

// Control simple
const nom = new FormControl('');

// Control avec validateurs
const email = new FormControl('', [
  Validators.required,
  Validators.email
]);

// Control avec valeur initiale et validateurs
const age = new FormControl(0, [
  Validators.required,
  Validators.min(18),
  Validators.max(100)
]);

// Vérifier l'état
console.log(email.valid);    // true/false
console.log(email.invalid);  // true/false
console.log(email.errors);   // { required: true } ou null
console.log(email.value);    // Valeur actuelle
```

**Validateurs courants :**

```typescript
import { Validators } from '@angular/forms';

Validators.required            // Champ obligatoire
Validators.email              // Format email
Validators.min(n)             // Valeur minimale
Validators.max(n)             // Valeur maximale
Validators.minLength(n)       // Longueur minimale
Validators.maxLength(n)       // Longueur maximale
Validators.pattern(/regex/)   // Expression régulière
```

**Exemple complet :**

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div>
      <input [formControl]="emailControl" placeholder="Email" />
      @if (emailControl.invalid && emailControl.touched) {
        <div class="error">
          @if (emailControl.errors?.['required']) {
            <p>L'email est requis</p>
          }
          @if (emailControl.errors?.['email']) {
            <p>Format email invalide</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .error { color: red; }
  `]
})
export class InscriptionComponent {
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
}
```

---

### SLIDE 17 : FormGroup et Validation Complexe

**Concepts théoriques :**

**FormGroup pour plusieurs champs :**

```typescript
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formulaire" (ngSubmit)="onSubmit()">
      <input formControlName="nom" placeholder="Nom" />
      <input formControlName="email" type="email" placeholder="Email" />
      <input formControlName="age" type="number" placeholder="Âge" />
      <button type="submit" [disabled]="formulaire.invalid">S'inscrire</button>
    </form>

    <div>
      <p>Valide : {{ formulaire.valid }}</p>
      <pre>{{ formulaire.value | json }}</pre>
    </div>
  `
})
export class InscriptionComponent {
  formulaire = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    age: new FormControl(0, [
      Validators.required,
      Validators.min(18)
    ])
  });

  onSubmit() {
    if (this.formulaire.valid) {
      console.log('Données valides:', this.formulaire.value);
    }
  }
}
```

**Accéder aux contrôles :**

```typescript
// Méthode 1 : get()
const nomControl = this.formulaire.get('nom');

// Méthode 2 : Getter (plus propre)
get nomControl() {
  return this.formulaire.get('nom');
}

get emailControl() {
  return this.formulaire.get('email');
}

// Utilisation dans le template
@if (nomControl?.invalid && nomControl?.touched) {
  <p>Nom invalide</p>
}
```

---

### SLIDE 18 : Validateurs Personnalisés

**Concepts théoriques :**

Créer vos propres validateurs pour des règles métier complexes.

**Structure d'un validateur :**

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validateur personnalisé
export function ageMinimumValidator(ageMin: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;

    if (age === null || age === undefined) {
      return null; // Ne valide pas si vide
    }

    if (age < ageMin) {
      return { ageMinimum: { requiredAge: ageMin, actualAge: age } };
    }

    return null; // Valide
  };
}
```

**Utilisation :**

```typescript
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ageMinimumValidator } from './validators';

@Component({
  selector: 'app-form',
  standalone: true,
  template: `
    <input [formControl]="ageControl" type="number" />
    @if (ageControl.errors?.['ageMinimum']) {
      <p>Vous devez avoir au moins {{ ageControl.errors?.['ageMinimum'].requiredAge }} ans</p>
    }
  `
})
export class FormComponent {
  ageControl = new FormControl(0, [
    Validators.required,
    ageMinimumValidator(18)
  ]);
}
```

**Exemples de validateurs personnalisés :**

```typescript
// Validateur de mot de passe fort
export function motDePasseFortValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);
    const isLongEnough = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isLongEnough;

    return passwordValid ? null : {
      motDePasseFaible: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecialChar,
        isLongEnough
      }
    };
  };
}

// Validateur de confirmation de mot de passe
export function motDePasseMatchValidator(controlName: string, matchControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchControl = formGroup.get(matchControlName);

    if (!control || !matchControl) {
      return null;
    }

    if (matchControl.errors && !matchControl.errors['motDePasseMatch']) {
      return null;
    }

    if (control.value !== matchControl.value) {
      matchControl.setErrors({ motDePasseMatch: true });
      return { motDePasseMatch: true };
    } else {
      matchControl.setErrors(null);
      return null;
    }
  };
}
```

---

### SLIDE 19 : Réactivité des Formulaires

**Concepts théoriques :**

Les formulaires réactifs exposent des observables pour réagir aux changements.

**valueChanges et statusChanges :**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <input [formControl]="searchControl" placeholder="Rechercher..." />
    <p>Recherche : {{ searchTerm }}</p>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchTerm = '';

  ngOnInit() {
    // Écouter les changements
    this.searchControl.valueChanges.pipe(
      debounceTime(300),              // Attendre 300ms
      distinctUntilChanged()          // Ignorer si même valeur
    ).subscribe(value => {
      this.searchTerm = value || '';
      console.log('Recherche:', value);
      // Appeler API ici
    });
  }
}
```

**Réagir à l'état du formulaire :**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  template: `
    <form [formGroup]="formulaire">
      <input formControlName="email" />
      <p>Status: {{ status }}</p>
    </form>
  `
})
export class FormComponent implements OnInit {
  formulaire = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  status = '';

  ngOnInit() {
    // Écouter le statut (VALID, INVALID, PENDING)
    this.formulaire.statusChanges.subscribe(status => {
      this.status = status;
    });

    // Écouter un control spécifique
    this.formulaire.get('email')?.valueChanges.subscribe(value => {
      console.log('Email changed:', value);
    });
  }
}
```

---

## PARTIE 3 : PRATIQUE - TPS (15h30-17h30)

### SLIDE 20 : TP1 - Recherche Réactive avec Debounce

**Énoncé du TP :**

Créez un composant de recherche avec les fonctionnalités suivantes :

1. Un input de recherche
2. Affichage des résultats filtrés
3. Debounce de 300ms
4. Indicateur de chargement
5. Compteur de résultats

**Objectifs pédagogiques :**
- Utiliser FormControl
- Implémenter debounceTime
- Gérer les observables
- Afficher des listes dynamiques

**Structure de départ :**

```typescript
// search.component.ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface Produit {
  id: number;
  nom: string;
  categorie: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="search-container">
      <h2>Recherche de Produits</h2>
      
      <!-- TODO: Ajouter l'input de recherche -->
      
      <!-- TODO: Ajouter l'indicateur de chargement -->
      
      <!-- TODO: Afficher le nombre de résultats -->
      
      <!-- TODO: Afficher la liste des résultats -->
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }
  `]
})
export class SearchComponent {
  searchControl = new FormControl('');
  
  produits: Produit[] = [
    { id: 1, nom: 'Ordinateur portable', categorie: 'Électronique' },
    { id: 2, nom: 'Souris sans fil', categorie: 'Électronique' },
    { id: 3, nom: 'Clavier mécanique', categorie: 'Électronique' },
    { id: 4, nom: 'Chaise de bureau', categorie: 'Mobilier' },
    { id: 5, nom: 'Bureau ajustable', categorie: 'Mobilier' },
    { id: 6, nom: 'Lampe LED', categorie: 'Éclairage' }
  ];

  // TODO: Implémenter la logique de recherche
}
```

**Indices :**
- Utilisez `valueChanges` sur le FormControl
- Utilisez `debounceTime(300)` pour attendre 300ms
- Filtrez le tableau avec `.filter()` et `.toLowerCase()`
- Utilisez un signal ou une propriété pour stocker les résultats

---

### SLIDE 20 (suite) : TP1 - Correction

**Corrigé complet :**

```typescript
// search.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Produit {
  id: number;
  nom: string;
  categorie: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="search-container">
      <h2>Recherche de Produits</h2>
      
      <div class="search-box">
        <input 
          [formControl]="searchControl"
          placeholder="Rechercher un produit..."
          type="text"
        />
        @if (isLoading()) {
          <span class="loading">Recherche...</span>
        }
      </div>

      <p class="results-count">
        {{ resultats().length }} résultat(s) trouvé(s)
      </p>

      <ul class="results-list">
        @for (produit of resultats(); track produit.id) {
          <li class="result-item">
            <strong>{{ produit.nom }}</strong>
            <span class="categorie">{{ produit.categorie }}</span>
          </li>
        } @empty {
          <li class="no-results">Aucun produit trouvé</li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    input {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
    }

    .loading {
      color: #007bff;
      font-style: italic;
    }

    .results-count {
      margin: 1rem 0;
      color: #666;
      font-weight: bold;
    }

    .results-list {
      list-style: none;
      padding: 0;
    }

    .result-item {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .result-item:hover {
      background-color: #f5f5f5;
    }

    .categorie {
      color: #007bff;
      font-size: 0.9rem;
      padding: 0.25rem 0.5rem;
      background-color: #e3f2fd;
      border-radius: 3px;
    }

    .no-results {
      padding: 2rem;
      text-align: center;
      color: #999;
      font-style: italic;
    }
  `]
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  isLoading = signal(false);
  resultats = signal<Produit[]>([]);
  
  produits: Produit[] = [
    { id: 1, nom: 'Ordinateur portable', categorie: 'Électronique' },
    { id: 2, nom: 'Souris sans fil', categorie: 'Électronique' },
    { id: 3, nom: 'Clavier mécanique', categorie: 'Électronique' },
    { id: 4, nom: 'Chaise de bureau', categorie: 'Mobilier' },
    { id: 5, nom: 'Bureau ajustable', categorie: 'Mobilier' },
    { id: 6, nom: 'Lampe LED', categorie: 'Éclairage' },
    { id: 7, nom: 'Écran 4K', categorie: 'Électronique' },
    { id: 8, nom: 'Webcam HD', categorie: 'Électronique' },
    { id: 9, nom: 'Casque audio', categorie: 'Électronique' },
    { id: 10, nom: 'Support ordinateur', categorie: 'Mobilier' }
  ];

  ngOnInit() {
    // Initialiser avec tous les produits
    this.resultats.set(this.produits);

    // Écouter les changements du champ de recherche
    this.searchControl.valueChanges.pipe(
      debounceTime(300),           // Attendre 300ms après la dernière frappe
      distinctUntilChanged()       // Ignorer si la valeur n'a pas changé
    ).subscribe(searchTerm => {
      this.rechercher(searchTerm || '');
    });
  }

  rechercher(term: string) {
    // Activer l'indicateur de chargement
    this.isLoading.set(true);

    // Simuler un délai de recherche
    setTimeout(() => {
      if (term === '') {
        this.resultats.set(this.produits);
      } else {
        const filtered = this.produits.filter(p =>
          p.nom.toLowerCase().includes(term.toLowerCase()) ||
          p.categorie.toLowerCase().includes(term.toLowerCase())
        );
        this.resultats.set(filtered);
      }

      this.isLoading.set(false);
    }, 200);
  }
}
```

**Points clés de la correction :**

1. **Debounce** : Attend 300ms après la dernière frappe
2. **distinctUntilChanged** : Évite les recherches inutiles
3. **Signals** : Utilisation moderne pour `isLoading` et `resultats`
4. **Control flow** : `@for` et `@if` pour l'affichage
5. **Recherche** : Filtre sur nom ET catégorie
6. **UX** : Indicateur de chargement et compteur de résultats

---

### SLIDE 21 : TP2 - Application de Gestion de Produits

**Énoncé du TP :**

Créez une application complète de gestion de produits avec :

1. **Service de gestion** :
   - Liste de produits avec Signals
   - Méthodes d'ajout/suppression
   - Statistiques calculées (computed)

2. **Formulaire d'ajout** :
   - Champs : nom, prix, stock
   - Validations complètes
   - Affichage des erreurs

3. **Liste des produits** :
   - Affichage en grille
   - Badge si stock faible (<10)
   - Bouton de suppression

4. **Statistiques** :
   - Nombre total de produits
   - Valeur totale du stock
   - Produits en stock faible

**Objectifs pédagogiques :**
- Architecture service + composants
- Formulaires réactifs complets
- Signals et computed
- Communication entre composants

**Structure de départ :**

```typescript
// produit.interface.ts
export interface Produit {
  id: number;
  nom: string;
  prix: number;
  stock: number;
}

// produit.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  // TODO: Implémenter le service avec Signals
}

// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <!-- TODO: Implémenter l'interface -->
  `
})
export class AppComponent {
  // TODO: Implémenter la logique
}
```

**Indices :**
- Utilisez `signal<Produit[]>()` pour la liste
- Utilisez `computed()` pour les statistiques
- FormGroup avec validateurs
- Méthode `.update()` pour modifier les signals

---

### SLIDE 21 (suite) : TP2 - Correction Complète

**Corrigé complet :**

```typescript
// produit.interface.ts
export interface Produit {
  id: number;
  nom: string;
  prix: number;
  stock: number;
}

// produit.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Produit } from './produit.interface';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  // État privé
  private produits = signal<Produit[]>([
    { id: 1, nom: 'Ordinateur portable', prix: 899.99, stock: 5 },
    { id: 2, nom: 'Souris sans fil', prix: 29.99, stock: 15 },
    { id: 3, nom: 'Clavier mécanique', prix: 129.99, stock: 8 }
  ]);

  // Exposer en readonly
  readonly produitsListe = this.produits.asReadonly();

  // Statistiques calculées
  readonly nombreProduits = computed(() => this.produits().length);

  readonly valeurTotale = computed(() => {
    return this.produits().reduce((sum, p) => sum + (p.prix * p.stock), 0);
  });

  readonly produitsStockFaible = computed(() => {
    return this.produits().filter(p => p.stock < 10);
  });

  readonly nombreStockFaible = computed(() => this.produitsStockFaible().length);

  // Méthodes
  ajouter(produit: Omit<Produit, 'id'>) {
    const nouveauProduit: Produit = {
      ...produit,
      id: Date.now()
    };

    this.produits.update(p => [...p, nouveauProduit]);
  }

  supprimer(id: number) {
    this.produits.update(p => p.filter(produit => produit.id !== id));
  }
}

// app.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProduitService } from './produit.service';
import { JsonPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, DecimalPipe],
  template: `
    <div class="app-container">
      <h1>Gestion de Produits</h1>

      <!-- Statistiques -->
      <div class="stats">
        <div class="stat-card">
          <h3>{{ produitService.nombreProduits() }}</h3>
          <p>Produits</p>
        </div>
        <div class="stat-card">
          <h3>{{ produitService.valeurTotale() | number:'1.2-2' }}€</h3>
          <p>Valeur totale</p>
        </div>
        <div class="stat-card alert">
          <h3>{{ produitService.nombreStockFaible() }}</h3>
          <p>Stock faible</p>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <div class="form-section">
        <h2>Ajouter un produit</h2>
        <form [formGroup]="formulaire" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom du produit</label>
            <input formControlName="nom" placeholder="Ex: Ordinateur portable" />
            @if (nomControl?.invalid && nomControl?.touched) {
              <div class="error">
                @if (nomControl?.errors?.['required']) {
                  <p>Le nom est requis</p>
                }
                @if (nomControl?.errors?.['minlength']) {
                  <p>Le nom doit faire au moins 3 caractères</p>
                }
              </div>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prix (€)</label>
              <input formControlName="prix" type="number" step="0.01" placeholder="0.00" />
              @if (prixControl?.invalid && prixControl?.touched) {
                <div class="error">
                  @if (prixControl?.errors?.['required']) {
                    <p>Le prix est requis</p>
                  }
                  @if (prixControl?.errors?.['min']) {
                    <p>Le prix doit être supérieur à 0</p>
                  }
                </div>
              }
            </div>

            <div class="form-group">
              <label>Stock</label>
              <input formControlName="stock" type="number" placeholder="0" />
              @if (stockControl?.invalid && stockControl?.touched) {
                <div class="error">
                  @if (stockControl?.errors?.['required']) {
                    <p>Le stock est requis</p>
                  }
                  @if (stockControl?.errors?.['min']) {
                    <p>Le stock ne peut pas être négatif</p>
                  }
                </div>
              }
            </div>
          </div>

          <button type="submit" [disabled]="formulaire.invalid">
            Ajouter le produit
          </button>
        </form>
      </div>

      <!-- Liste des produits -->
      <div class="products-section">
        <h2>Liste des produits</h2>
        <div class="products-grid">
          @for (produit of produitService.produitsListe(); track produit.id) {
            <div class="product-card" [class.low-stock]="produit.stock < 10">
              <div class="product-header">
                <h3>{{ produit.nom }}</h3>
                @if (produit.stock < 10) {
                  <span class="badge">Stock faible</span>
                }
              </div>
              <div class="product-info">
                <p class="price">{{ produit.prix | number:'1.2-2' }}€</p>
                <p class="stock">Stock: {{ produit.stock }}</p>
                <p class="total">Valeur: {{ (produit.prix * produit.stock) | number:'1.2-2' }}€</p>
              </div>
              <button class="delete-btn" (click)="supprimer(produit.id)">
                Supprimer
              </button>
            </div>
          } @empty {
            <p class="no-products">Aucun produit. Ajoutez-en un ci-dessus.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    /* Statistiques */
    .stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-card.alert {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
    }

    .stat-card p {
      margin: 0;
      opacity: 0.9;
    }

    /* Formulaire */
    .form-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .form-section h2 {
      margin-top: 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row .form-group {
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #555;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    input:invalid:not(:focus):not(:placeholder-shown) {
      border-color: #f5576c;
    }

    .error {
      color: #f5576c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .error p {
      margin: 0.25rem 0;
    }

    button[type="submit"] {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    button[type="submit"]:hover:not(:disabled) {
      opacity: 0.9;
    }

    button[type="submit"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Produits */
    .products-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .products-section h2 {
      margin-top: 0;
      color: #333;
    }

    .products-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .product-card {
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.2s;
    }

    .product-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .product-card.low-stock {
      border-color: #f5576c;
      background-color: #fff5f5;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .product-header h3 {
      margin: 0;
      color: #333;
    }

    .badge {
      background-color: #f5576c;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .product-info {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .product-info p {
      margin: 0;
      color: #666;
    }

    .price {
      font-size: 1.25rem;
      font-weight: bold;
      color: #667eea !important;
    }

    .delete-btn {
      padding: 0.5rem 1rem;
      background-color: #f5576c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: opacity 0.2s;
    }

    .delete-btn:hover {
      opacity: 0.9;
    }

    .no-products {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats {
        flex-direction: column;
      }

      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class AppComponent {
  constructor(public produitService: ProduitService) { }

  formulaire = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    prix: new FormControl(0, [
      Validators.required,
      Validators.min(0.01)
    ]),
    stock: new FormControl(0, [
      Validators.required,
      Validators.min(0)
    ])
  });

  get nomControl() {
    return this.formulaire.get('nom');
  }

  get prixControl() {
    return this.formulaire.get('prix');
  }

  get stockControl() {
    return this.formulaire.get('stock');
  }

  onSubmit() {
    if (this.formulaire.valid) {
      const { nom, prix, stock } = this.formulaire.value;
      this.produitService.ajouter({
        nom: nom!,
        prix: prix!,
        stock: stock!
      });
      this.formulaire.reset({ nom: '', prix: 0, stock: 0 });
    }
  }

  supprimer(id: number) {
    this.produitService.supprimer(id);
  }
}
```

**Tests à effectuer :**
1. ✅ Ajouter des produits avec le formulaire
2. ✅ Valider les champs (prix > 0, stock ≥ 0)
3. ✅ Les statistiques se mettent à jour
4. ✅ Supprimer un produit
5. ✅ Les produits avec stock faible changent de couleur
6. ✅ La valeur totale se calcule correctement

---

### SLIDE 22 : Points Clés du TP2

**EXPLICATIONS DÉTAILLÉES :**

**1. Service avec Signals et Computed :**

```typescript
produits = signal<Produit[]>([...]);
totalValeur = computed(() => {
  return this.produits().reduce((sum, p) => sum + (p.prix * p.stock), 0);
});
```

Les `computed` se recalculent automatiquement quand les dépendances changent.

**2. Validation de formulaire :**

```typescript
prix: new FormControl(0, [
  Validators.required,
  Validators.min(0.01)
])
```

`min(0.01)` empêche les prix négatifs ou zéro.

**3. Récupération des contrôles :**

```typescript
get nomControl() {
  return this.formulaire.get('nom');
}
```

Raccourci pour accéder aux contrôles dans le template.

**4. Communication parent-enfant :**

```typescript
// Parent → Enfant
<app-produit-item [produit]="produit"></app-produit-item>

// Enfant
@Input() produit!: Produit;
```

**5. Mise à jour du signal :**

```typescript
this.produits.update(p => [...p, newProduit]);
```

La méthode `update` permet une transformation immutable.

**6. Flexbox CSS pour responsive :**

```css
.stats {
  display: flex;
  gap: 1rem;
}

/* Sur mobile */
@media (max-width: 768px) {
  .stats {
    flex-direction: column;
  }
}
```

---

### SLIDE 23 : Améliorations Possibles (Bonus)

**Si vous avez du temps, ajoutez :**

**1. Édition de produit :**

```typescript
// Dans le service
mettreAJourProduit(id: number, updates: Partial<Produit>) {
  this.produits.update(p =>
    p.map(prod => prod.id === id ? { ...prod, ...updates } : prod)
  );
}

// Créer un composant d'édition
@Component({
  selector: 'app-produit-edit',
  template: `...`
})
export class ProduitEditComponent {
  @Input() produit!: Produit;
  // Formulaire pour éditer
}
```

**2. Tri et filtrage :**

```typescript
// Dans le service
filtrePrix = signal(999999);
produitsTriés = computed(() => {
  return this.produits()
    .filter(p => p.prix <= this.filtrePrix())
    .sort((a, b) => a.prix - b.prix);
});

// Dans le template
<input
  type="range"
  [formControl]="prixMax"
@for (produit of produitService.produitsTriés(); track produit.id)
```

**3. Persistence en localStorage :**

```typescript
private chargerDonnees() {
  const saved = localStorage.getItem('produits');
  if (saved) {
    this.produits.set(JSON.parse(saved));
  }
}

effect(() => {
  localStorage.setItem('produits', JSON.stringify(this.produits()));
});
```

**4. Export en CSV :**

```typescript
exporterCSV() {
  const csv = this.produits().map(p =>
    `${p.id},${p.nom},${p.prix},${p.stock}`
  ).join('\n');
  // Télécharger le fichier
}
```

---

### SLIDE 24 : Résumé du Jour 2

**Ce que vous avez appris :**

✅ **Programmation Réactive :**
- Principes RxJS Observables
- Opérateurs essentiels (map, filter, debounceTime, switchMap)
- Gestion des souscriptions
- Mode Zoneless pour la performance

✅ **Signals (API Moderne) :**
- Créer et modifier des signals
- Computed values
- Effects
- Intégration Signal/Observable

✅ **Communication Avancée :**
- Input/Output Signals
- Cycle de vie des composants
- @ViewChild, @ContentChild
- Décorateurs avancés

✅ **Services Optimisés :**
- Injection de dépendances
- Hiérarchie des injecteurs
- Services avec Standalone Components
- Patterns Service + Signal + RxJS

✅ **Formulaires Réactifs :**
- FormControl et FormGroup
- Validations intégrées et personnalisées
- Affichage des erreurs
- Soumission de données

✅ **Pratique :**
- Système de recherche réactif
- Application de gestion de produits
- Architecture multi-composants

---

### SLIDE 25 : Préparation Jour 3

**Jour 3 couvrira :**

1. **Routage et Navigation**
   - Routes et path
   - Paramètres et query params
   - Lazy loading
   - Protections (Guards)

2. **Requêtes HTTP Avancées**
   - HttpClient
   - Interceptors
   - Gestion d'erreurs
   - Retry logic

3. **État Global (State Management)**
   - NgRx/Store
   - Actions et Reducers
   - Selectors
   - Effects

4. **Testing**
   - Tests unitaires (Jasmine)
   - Tests de composants
   - Mocking des services
   - Tests d'intégration

5. **Performance et Optimisation**
   - Change Detection Strategy
   - TrackBy
   - Lazy loading
   - Code splitting

---

## ANNEXE : CHEAT SHEET JOUR 2

### RxJS Opérateurs

```typescript
// Transformation
map(x => x * 2)
filter(x => x > 5)
switchMap(x => httpCall())

// Timing
debounceTime(300)
throttleTime(1000)
delay(500)

// Combination
merge(obs1, obs2)
combineLatest([obs1, obs2])
withLatestFrom(obs1)

// Gestion
take(5)
takeUntil(stop$)
startWith(0)
distinctUntilChanged()
```

### Signals API

```typescript
// Créer
const count = signal(0);

// Lire
const val = count();

// Modifier
count.set(5);
count.update(v => v + 1);

// Dérivé
const double = computed(() => count() * 2);

// Écouter
effect(() => {
  console.log(count());
});

// Convertir
const obs = toObservable(signal);
const sig = toSignal(observable$, { initialValue: 0 });
```

### FormGroup et Validation

```typescript
// Créer
const form = new FormGroup({
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ])
});

// Accéder
form.value           // Valeurs
form.valid          // true/false
form.get('email')   // Un control

// Observer
form.valueChanges.subscribe(...)
form.statusChanges.subscribe(...)

// Validateurs courants
Validators.required
Validators.email
Validators.minLength(n)
Validators.maxLength(n)
Validators.min(n)
Validators.max(n)
Validators.pattern(regex)
```

### Décorateurs Avancés

```typescript
@Input()           // Propriété en entrée
@Output()          // Événement en sortie
@ViewChild()       // Accéder à un enfant
@ContentChild()    // Accéder au contenu projeté
@HostListener()    // Écouter l'élément hôte
@HostBinding()     // Binder à l'élément hôte

// Modernes (Signals - Angular 17+)
input()            // Input Signal
input.required()   // Input Signal requis
output()           // Output Signal
viewChild()        // ViewChild Signal
contentChild()     // ContentChild Signal
```

### Cycle de Vie

```typescript
OnInit              // Après init (appels API)
OnChanges           // Entrées changées
DoCheck             // Vérification manuelle
AfterViewInit       // Vues initialisées (DOM)
AfterContentInit    // Contenu initialisé
OnDestroy           // Avant destruction (cleanup)
```

### Observable Types

```typescript
// Cold Observable
const cold$ = new Observable(obs => {
  obs.next(Math.random());
});

// Hot Observable
const hot$ = new Subject();

// BehaviorSubject (avec valeur initiale)
const behavior$ = new BehaviorSubject(0);

// ReplaySubject (rejoue N valeurs)
const replay$ = new ReplaySubject(3);
```

---

**FIN DU JOUR 2**

*Vous maîtrisez maintenant la réactivité et les services ! 🚀*
