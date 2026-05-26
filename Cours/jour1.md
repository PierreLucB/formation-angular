# Formation Angular 20 - Jour 1
## Programme Complet : Fondamentaux


## PARTIE 1 : RAPPELS JAVASCRIPT / TYPESCRIPT MODERNES (9h15-12h30)

### SLIDE 1 : Accueil et Objectifs du Jour 1

**Bienvenue au Jour 1 !**

Aujourd'hui, nous posons les fondations solides avant de plonger dans Angular.

**Objectifs du Jour 1 :**
- Consolider les connaissances JavaScript/TypeScript modernes
- Comprendre les fondamentaux d'Angular
- Créer votre première application interactive

**Planning :**
- 9h15-12h30 : Rappels JavaScript/TypeScript + Installation
- 12h30-13h30 : Déjeuner
- 13h30-17h30 : Fondamentaux Angular + Mini-app

---

### SLIDE 2 : ECMAScript - Évolutions Majeures (ES6 à Aujourd'hui)

**ECMAScript est le standard JavaScript**

**ES6 (2015) - La révolution :**
- Classes et constructeurs
- Modules (import/export)
- let et const
- Fonctions fléchées (arrow functions)
- Destructuration
- Template literals

**ES7+ (2016-2024) - Les extensions :**
- Async/await (ES2017) - pour les opérations asynchrones
- Nullish coalescing ?? (ES2020)
- Optional chaining ?. (ES2020)
- BigInt (ES2020)

**Pourquoi c'est important pour Angular :**
Angular utilise TypeScript (superset de JavaScript) et exploite toutes ces fonctionnalités modernes.

---

### SLIDE 3 : Classes et Modules ES6

**Les Classes ES6 :**

```typescript
class Animal {
  nom: string;

  constructor(nom: string) {
    this.nom = nom;
  }

  crier() {
    console.log(`${this.nom} crie`);
  }
}

class Chien extends Animal {
  crier() {
    console.log(`${this.nom} aboie`);
  }
}

const chien = new Chien('Rex');
chien.crier(); // Rex aboie
```

**Les Modules ES6 :**

```typescript
// Fichier : math-utils.ts
export function additionner(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

// Fichier : main.ts
import { additionner, PI } from './math-utils';
console.log(additionner(2, 3)); // 5
```

**En Angular :**
- Chaque composant est une classe
- Chaque fichier est un module (import/export)
- La réutilisation se fait via modules

---

### SLIDE 4 : Fonctions Fléchées et Lexical this

**Différence cruciale : this**

```typescript
// Fonction traditionnelle - this dépend de l'appelant
const obj1 = {
  nom: 'Alice',
  saluer: function() {
    console.log(this.nom); // Alice
  }
};
obj1.saluer(); // Affiche : Alice

// Fonction fléchée - this du scope parent (lexical)
const obj2 = {
  nom: 'Bob',
  saluer: () => {
    console.log(this.nom); // undefined (this est global)
  }
};
obj2.saluer(); // Affiche : undefined

// Cas d'usage avec Array
const nombres = [1, 2, 3, 4, 5];
const doubles = nombres.map(n => n * 2); // [2, 4, 6, 8, 10]
```

**Pourquoi c'est important pour Angular :**
Angular utilise les fonctions fléchées dans les callbacks et RxJS observables.

---

### SLIDE 5 : Promesses

**Les Promesses gèrent l'asynchrone**

```typescript
// Créer une promesse
const maPromesse = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve('Succès !');
  }, 1000);
});

// Utiliser avec .then()
maPromesse
  .then(resultat => console.log(resultat))
  .catch(erreur => console.log(erreur));

// États d'une promesse :
// - Pending (en attente)
// - Fulfilled (résolue avec une valeur)
// - Rejected (rejetée avec une erreur)
```

**Chaîner des promesses :**

```typescript
fetch('/api/users/1')
  .then(response => response.json())
  .then(user => console.log(user))
  .catch(error => console.error(error));
```

**En Angular :**
Angular utilise les Observables (évolution des Promesses) pour les requêtes HTTP.

---

### SLIDE 6 : Async/Await

**Syntaxe plus lisible pour les promesses**

```typescript
// Avec .then() - difficile à lire
function obtenirUtilisateur() {
  return fetch('/api/users/1')
    .then(response => response.json())
    .then(user => user);
}

// Avec async/await - lisible comme du code synchrone
async function obtenirUtilisateur() {
  const response = await fetch('/api/users/1');
  const user = await response.json();
  return user;
}

// Gestion d'erreur
async function obtenirUtilisateur() {
  try {
    const response = await fetch('/api/users/1');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Erreur :', error);
  }
}
```

**Règles :**
- `async` = la fonction retourne une Promesse
- `await` = attendre la résolution
- Ne peut être utilisé que dans une fonction `async`

**En Angular :**
Angular utilise async/await dans les composants et services pour les opérations asynchrones.

---

### SLIDE 7 : Introduction à TypeScript - Typage Statique

**TypeScript = JavaScript + Types Statiques**

```typescript
// Typage basique
let nom: string = 'Alice';
let age: number = 30;
let actif: boolean = true;

// Types union
let valeur: string | number = 42;
valeur = 'texte'; // OK
valeur = true; // ❌ Erreur TypeScript

// Tableaux
let nombres: number[] = [1, 2, 3];
let textes: Array<string> = ['a', 'b'];

// Any - à éviter
let quelconque: any = 42; // Pas de vérification de type
```

**Types d'objets :**

```typescript
interface Utilisateur {
  nom: string;
  age: number;
  email?: string; // Optionnel
}

const user: Utilisateur = {
  nom: 'Alice',
  age: 30
};
```

**Avantages :**
- Erreurs détectées à la compilation, pas en production
- Meilleure autocomplétion dans l'IDE
- Documentation du code via les types

---

### SLIDE 8 : Génériques et Interfaces

**Génériques pour le code réutilisable**

```typescript
// Fonction générique
function obtenirPremier<T>(tableau: T[]): T {
  return tableau[0];
}

const premiers = obtenirPremier<number>([1, 2, 3]); // Type: number
const premierMot = obtenirPremier<string>(['a', 'b']); // Type: string

// Interface générique
interface Conteneur<T> {
  valeur: T;
  obtenir(): T;
}

const conteneur: Conteneur<string> = {
  valeur: 'Hello',
  obtenir() { return this.valeur; }
};
```

**Interfaces vs Types :**

```typescript
// Interface - pour les contrats de classe
interface Animal {
  nom: string;
  crier(): void;
}

class Chien implements Animal {
  nom = 'Rex';
  crier() { console.log('Woof'); }
}

// Type - pour les alias
type Coordonnees = {
  x: number;
  y: number;
};

const point: Coordonnees = { x: 10, y: 20 };
```

---

### SLIDE 9 : Décorateurs TypeScript 5.x

**Les décorateurs modifient classes, méthodes, propriétés**

```typescript
// Décorateur de classe
function Loggable(target: Function) {
  console.log(`Classe créée : ${target.name}`);
}

@Loggable
class MaClasse {
  nom = 'Test';
}

// Décorateur avec paramètres
function LoggerMethode(prefix: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const methodeOriginale = descriptor.value;

    descriptor.value = function(...args: any[]) {
      console.log(`${prefix} - Appel de ${propertyKey}`);
      return methodeOriginale.apply(this, args);
    };

    return descriptor;
  };
}

class Service {
  @LoggerMethode('APP')
  obtenirDonnees() {
    return 'Données';
  }
}
```

**En Angular :**
@Component, @Injectable, @Input, @Output sont des décorateurs. C'est la base d'Angular !

---

### SLIDE 10 : TP - Installation Environnement

**EXERCICE 1 : Configuration de l'Environnement**

**Durée : 45 minutes**

**Étapes :**

1. **Installez Node.js**
   - Allez sur https://nodejs.org (version LTS, ≥ 18)
   - Téléchargez et installez
   - Vérifiez :
   ```bash
   node --version
   npm --version
   ```

2. **Installez Angular CLI**
   ```bash
   npm install -g @angular/cli@latest
   ng version
   ```

3. **Installez VS Code** (si absent)
   - https://code.visualstudio.com
   - Extensions recommandées :
     - Angular Language Service
     - Prettier
     - ES7+ snippets

4. **Créez votre premier projet Angular**
   ```bash
   ng new mon-app-angular
   cd mon-app-angular
   ng serve
   ```
   - Ouvrez http://localhost:4200

5. **Explorez la structure**
   - `src/main.ts` - Entrée
   - `src/app/` - Code applicatif
   - `angular.json` - Config Angular

**À faire :** Tous les participants doivent avoir une app Angular en cours d'exécution.

---

### SLIDE 11 : TP - Premiers Pas TypeScript

**EXERCICE 2 : Typage TypeScript**

**Durée : 30 minutes**

**Fichier à créer : `src/app/models/utilisateur.ts`**

```typescript
// Créez une interface utilisateur
export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  age?: number;
}

// Créez un type pour un tableau d'utilisateurs
export type ListeUtilisateurs = Utilisateur[];

// Créez une fonction typée
export function afficherUtilisateur(user: Utilisateur): string {
  return `${user.nom} (${user.email})`;
}

// Utilisez-les
const users: ListeUtilisateurs = [
  { id: 1, nom: 'Alice', email: 'alice@mail.com', age: 30 },
  { id: 2, nom: 'Bob', email: 'bob@mail.com' }
];

users.forEach(user => {
  console.log(afficherUtilisateur(user));
});
```

**À faire :**
1. Créez ce fichier
2. Importez-le dans `app.component.ts`
3. Exécutez et vérifiez dans la console

---

## PARTIE 2 : LES FONDAMENTAUX D'ANGULAR (13h30-17h30)

### SLIDE 12 : Architecture Angular - Vue d'Ensemble

**Une application Angular est composée de :**

```
APPLICATION ANGULAR
├─ COMPOSANTS (UI + Logique)
│  ├─ Template HTML
│  ├─ Classe TypeScript
│  └─ Styles CSS (optionnel)
│
├─ SERVICES (Logique métier)
│  ├─ Récupération données
│  ├─ Logique métier
│  └─ Partage d'état
│
├─ DIRECTIVES & PIPES
│  ├─ Modifient le DOM
│  └─ Transforment les données
│
└─ ROUTAGE
   ├─ Navigation
   ├─ Paramètres
   └─ Guards
```

**Cycle de développement :**
1. Créer composants (UI)
2. Créer services (logique)
3. Connecter via injection de dépendances
4. Gérer les données et événements
5. Router et naviguer

---

### SLIDE 13 : Angular CLI et Compilation

**Angular CLI automatise tout**

```bash
# Créer un projet
ng new ma-app

# Servir en développement (hot reload)
ng serve
ng serve -o  # Ouvre le navigateur

# Générer des fichiers
ng generate component mon-composant
ng generate service mon-service
ng g c composant  # Raccourci

# Builder pour la production
ng build
ng build --configuration production

# Tests
ng test
ng e2e
```

**Angular 20 utilise esbuild par défaut :**
- Compilateur ultra-rapide
- Builds instantanés
- Hot Module Replacement (HMR)

---

### SLIDE 14 : Composants Angular - Structure

**Un composant = Template + Classe + Styles**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-salutation',
  standalone: true,
  template: `
    <h1>Bonjour {{ nom }}</h1>
    <p>Bienvenue dans Angular!</p>
  `,
  styles: [`
    h1 { color: blue; }
    p { font-size: 14px; }
  `]
})
export class SalutationComponent {
  nom: string = 'Alice';
}
```

**Ou avec fichiers séparés :**

```typescript
@Component({
  selector: 'app-salutation',
  standalone: true,
  templateUrl: './salutation.component.html',
  styleUrls: ['./salutation.component.css']
})
export class SalutationComponent {
  nom: string = 'Alice';
}
```

**Propriétés importantes :**
- `selector` : Nom de la balise HTML
- `standalone` : Composant autonome (Angular 14+)
- `template/templateUrl` : Contenu HTML
- `styles/styleUrls` : Encapsulation CSS

---

### SLIDE 15 : Data Binding - Interpolation

**L'interpolation affiche des valeurs dans le template**

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <p>Nom : {{ nom }}</p>
    <p>Âge : {{ age }}</p>
    <p>Calcul : {{ 2 + 3 }}</p>
    <p>Majuscule : {{ nom | uppercase }}</p>
  `
})
export class DemoComponent {
  nom: string = 'Alice';
  age: number = 30;
}
```

**Affichage :**
```
Nom : Alice
Âge : 30
Calcul : 5
Majuscule : ALICE
```

**Limitation :** L'interpolation affiche uniquement des valeurs, pas de boucles.

---

### SLIDE 16 : Data Binding - Property Binding

**Property binding lie une propriété DOM à une propriété TypeScript**

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <!-- Property binding -->
    <img [src]="imageSrc" [alt]="altText">
    <button [disabled]="estDesactif">Cliquez-moi</button>
    <div [title]="nom">Survol-moi</div>
    <p [innerHTML]="contenuHTML"></p>
  `
})
export class DemoComponent {
  imageSrc: string = '/assets/image.png';
  altText: string = 'Ma photo';
  estDesactif: boolean = true;
  nom: string = 'Alice';
  contenuHTML: string = '<strong>Texte gras</strong>';
}
```

**Syntaxe :** `[propriete]="expression"`

---

### SLIDE 17 : Data Binding - Event Binding

**Event binding écoute les événements utilisateur**

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <button (click)="cliquer()">Cliquez-moi</button>
    <button (click)="cliquerAvecParam('Alice')">Cliquez Alice</button>
    <input (keyup)="saisir($event)">
    <input (change)="changement($event)">
  `
})
export class DemoComponent {
  cliquer() {
    console.log('Bouton cliqué');
  }

  cliquerAvecParam(nom: string) {
    console.log(`Cliqué par ${nom}`);
  }

  saisir(event: Event) {
    const valeur = (event.target as HTMLInputElement).value;
    console.log(`Valeur saisie : ${valeur}`);
  }

  changement(event: Event) {
    console.log('Changement détecté');
  }
}
```

**Syntaxe :** `(evenement)="methode()"`

**Événements courants :** click, keyup, change, blur, focus, submit

---

### SLIDE 18 : Two-Way Binding

**Two-way binding = Property Binding + Event Binding**

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="nom" placeholder="Entrez votre nom">
    <p>Vous avez saisi : {{ nom }}</p>
  `
})
export class DemoComponent {
  nom: string = '';
}
```

**Syntaxe :** `[(ngModel)]="propriete"` - "Banana in a box"

**Important :** Importez `FormsModule` pour utiliser ngModel.

---

### SLIDE 19 : Control Flow - @if, @for, @switch

**Angular 17+ introduit les control flows natifs**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <!-- @if / @else -->
    @if (utilisateur) {
      <p>Bienvenue {{ utilisateur.nom }}</p>
    } @else {
      <p>Veuillez vous connecter</p>
    }

    <!-- @for -->
    <ul>
      @for (item of items; track item.id) {
        <li>{{ item.nom }} - {{ item.prix }}€</li>
      }
    </ul>

    <!-- @switch -->
    @switch (statut) {
      @case ('actif') {
        <span class="badge-vert">Actif</span>
      }
      @case ('inactif') {
        <span class="badge-rouge">Inactif</span>
      }
      @default {
        <span class="badge-grise">Inconnu</span>
      }
    }
  `
})
export class DemoComponent {
  utilisateur = { nom: 'Alice' };
  items = [
    { id: 1, nom: 'Produit A', prix: 10 },
    { id: 2, nom: 'Produit B', prix: 20 }
  ];
  statut: string = 'actif';
}
```

**Important :** Utilisez `track` dans @for pour la performance !

---

### SLIDE 20 : Directives et Pipes

**Directives modifient le DOM**

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle],
  template: `
    <!-- *ngIf -->
    <p *ngIf="afficher">Message visible</p>

    <!-- *ngFor -->
    <div *ngFor="let item of items">
      {{ item.nom }}
    </div>

    <!-- ngClass -->
    <div [ngClass]="{'actif': estActif, 'desactif': !estActif}">
      Classe dynamique
    </div>

    <!-- ngStyle -->
    <div [ngStyle]="{'color': couleur, 'font-size': taille + 'px'}">
      Style dynamique
    </div>
  `
})
export class DemoComponent {
  afficher: boolean = true;
  items = [{ nom: 'Item 1' }, { nom: 'Item 2' }];
  estActif: boolean = true;
  couleur: string = 'blue';
  taille: number = 16;
}
```

**Pipes transforment les données**

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <p>{{ nom | uppercase }}</p>
    <p>{{ nom | lowercase }}</p>
    <p>{{ prix | currency }}</p>
    <p>{{ date | date:'short' }}</p>
    <p>{{ nombre | number:'1.2-2' }}</p>
  `
})
export class DemoComponent {
  nom: string = 'alice';
  prix: number = 99.99;
  date: Date = new Date();
  nombre: number = 1234.5678;
}
```

**Pipes courants :** uppercase, lowercase, currency, date, number, percent, slice, json

---

### SLIDE 21 : Encapsulation CSS

**Angular encapsule les styles par composant**

```typescript
@Component({
  selector: 'app-bouton',
  standalone: true,
  template: `<button>Cliquez-moi</button>`,
  styles: [`
    button {
      background-color: blue;
      color: white;
    }
  `]
})
export class BoutonComponent { }

@Component({
  selector: 'app-racine',
  standalone: true,
  imports: [BoutonComponent],
  template: `
    <app-bouton></app-bouton>
    <button>Autre bouton</button>
  `,
  styles: [`
    button {
      background-color: red;
    }
  `]
})
export class RacineComponent { }
```

**Résultat :**
- Le premier bouton = bleu (styles de BoutonComponent)
- Le second bouton = rouge (styles de RacineComponent)

**Avantages :**
- Pas de conflits CSS
- Styles locaux au composant
- Maintenabilité

---

### SLIDE 22 : Standalone Components

**Angular 14+ : Composants autonomes sans NgModule**

```typescript
// Approche moderne (Standalone)
@Component({
  selector: 'app-salut',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `...`
})
export class SalutComponent { }

// Bootstrap avec standalone
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent);
```

**Avantages :**
- Plus simple
- Meilleure tree-shaking
- Arborescence plus claire
- À utiliser par défaut (2024+)

---

### SLIDE 23 : TP - Todo List Application

**EXERCICE 3 : Créer une Todo List Complète**

**Durée : 1h30**

**Objectifs :**
Créer une application de gestion de tâches (Todo List) complète en utilisant :
- Les Signals pour la réactivité
- L'injection de dépendances
- Les composants standalone
- La nouvelle syntaxe de flux de contrôle (@if, @for)
- Le FormsModule pour le two-way binding

**Fonctionnalités à implémenter :**
1. Afficher une liste de tâches
2. Ajouter une nouvelle tâche
3. Marquer une tâche comme terminée/non terminée
4. Supprimer une tâche
5. Afficher des statistiques (nombre total, nombre terminé)
6. Message si la liste est vide

**Structure du projet :**
- Un modèle `Todo` (interface)
- Un service `TodoService` pour gérer la logique
- Un composant `TodoListComponent` pour l'interface
- Intégration dans `AppComponent`

**Consignes :**
1. Créez les fichiers dans l'ordre indiqué ci-dessous
2. Utilisez les Signals pour la gestion d'état
3. Appliquez du style CSS pour rendre l'interface agréable
4. Testez toutes les fonctionnalités

---

### SLIDE 24 : CORRECTION - Todo List Application

**CORRECTION EXERCICE 3**

**Fichier 1 : `src/app/models/todo.ts`**

```typescript
export interface Todo {
  id: number;
  titre: string;
  termine: boolean;
  dateCreation: Date;
}
```

**Fichier 2 : `src/app/services/todo.service.ts`**

```typescript
import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = signal<Todo[]>([
    { id: 1, titre: 'Apprendre Angular', termine: false, dateCreation: new Date() },
    { id: 2, titre: 'Créer un projet', termine: false, dateCreation: new Date() }
  ]);

  getTodos() {
    return this.todos();
  }

  ajouterTodo(titre: string) {
    const newId = Math.max(...this.todos().map(t => t.id), 0) + 1;
    this.todos.update(todos => [
      ...todos,
      { id: newId, titre, termine: false, dateCreation: new Date() }
    ]);
  }

  basculerTodo(id: number) {
    this.todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, termine: !t.termine } : t)
    );
  }

  supprimerTodo(id: number) {
    this.todos.update(todos => todos.filter(t => t.id !== id));
  }
}
```

**Fichier 3 : `src/app/components/todo-list/todo-list.component.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  template: `
    <div class="container">
      <h1>Ma Todo List</h1>

      <div class="input-section">
        <input
          [(ngModel)]="nouvelleTache"
          (keyup.enter)="ajouterTache()"
          placeholder="Nouvelle tâche..."
        >
        <button (click)="ajouterTache()">Ajouter</button>
      </div>

      <div class="stats">
        <p>Total : {{ todos().length }}</p>
        <p>Complétées : {{ completees() }}</p>
      </div>

      <ul class="todo-list">
        @for (todo of todos(); track todo.id) {
          <li [class.termine]="todo.termine">
            <input
              type="checkbox"
              [checked]="todo.termine"
              (change)="basculerTodo(todo.id)"
            >
            <span>{{ todo.titre }}</span>
            <button (click)="supprimerTodo(todo.id)" class="btn-delete">×</button>
          </li>
        }
      </ul>

      @if (todos().length === 0) {
        <p class="empty">Aucune tâche. Créez-en une!</p>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .input-section {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .stats {
      background-color: #f5f5f5;
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    .todo-list {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 12px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    li.termine {
      opacity: 0.6;
    }

    li.termine span {
      text-decoration: line-through;
      color: #999;
    }

    .btn-delete {
      width: 30px;
      height: 30px;
      padding: 0;
      background-color: #dc3545;
    }

    .empty {
      text-align: center;
      color: #999;
      padding: 20px;
    }
  `]
})
export class TodoListComponent {
  todoService = inject(TodoService);
  nouvelleTache = '';

  get todos() {
    return () => this.todoService.getTodos();
  }

  get completees() {
    return () => this.todoService.getTodos().filter(t => t.termine).length;
  }

  ajouterTache() {
    if (this.nouvelleTache.trim()) {
      this.todoService.ajouterTodo(this.nouvelleTache);
      this.nouvelleTache = '';
    }
  }

  basculerTodo(id: number) {
    this.todoService.basculerTodo(id);
  }

  supprimerTodo(id: number) {
    this.todoService.supprimerTodo(id);
  }
}
```

**Fichier 4 : `src/app/app.component.ts`**

```typescript
import { Component } from '@angular/core';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent],
  template: `<app-todo-list></app-todo-list>`,
  styles: [`
    :host {
      display: block;
      background-color: #f9f9f9;
      min-height: 100vh;
    }
  `]
})
export class AppComponent { }
```

**Tests à effectuer :**
- ✅ Ajouter une tâche
- ✅ Cocher/décocher une tâche