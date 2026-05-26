# Formation Angular 20 - Jour 4
## Programme Complet : Tests, Qualité & Déploiement

---

## PARTIE 1 : TESTS ET QUALITÉ DU CODE (9h00-12h30)

### SLIDE 1 : Accueil et Récapitulatif Jours 1-3

**Contenu à présenter :**

Bienvenue au dernier jour ! Vous avez construit des applications complètes. Aujourd'hui, nous les rendons robustes et les mettons en production.

**Récapitulatif rapide :**
- Jour 1 : Fondamentaux & TypeScript
- Jour 2 : Réactivité & Services
- Jour 3 : Routing & HTTP

**Aujourd'hui :**
- Tester chaque ligne de code
- Garantir la qualité
- Optimiser les performances
- Déployer en production
- Intégrer l'IA

**Objectif :** Application complète, testée et en production.

---

### SLIDE 2 : Écosystème de Test Angular

**Concepts théoriques à présenter :**

Angular 20 offre un écosystème complet de test moderne.

```
┌─────────────────────────────────┐
│    ÉCOSYSTÈME DE TEST ANGULAR   │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │   FRAMEWORKS            │    │
│  │ - Jasmine (défaut)      │    │
│  │ - Vitest (alternatif)   │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   RUNNERS               │    │
│  │ - Karma (traditionnel)  │    │
│  │ - Vitest (moderne)      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   OUTILS                │    │
│  │ - Istanbul (couverture) │    │
│  │ - Cypress (E2E)         │    │
│  │ - Playwright (E2E)      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   UTILITIES             │    │
│  │ - TestBed               │    │
│  │ - DebugElement          │    │
│  │ - async/fakeAsync       │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Configuration par défaut (Karma + Jasmine) :**

```bash
# Lancer les tests
ng test

# Tests une seule fois
ng test --no-watch

# Avec couverture
ng test --code-coverage

# Navigateur spécifique
ng test --browsers=ChromeHeadless

# E2E tests
ng e2e
```

**Types de tests :**

```
PYRAMIDE DES TESTS
──────────────────

          E2E (5%)
       /            \
      /  Tests       \
     /  d'intégration \
    /    (15%)         \
   /                    \
  /____ Tests _____ _____\
      unitaires (80%)


- Tests Unitaires : Tester une fonction/service isolé
- Tests d'Intégration : Tester plusieurs composants ensemble
- Tests E2E : Tester l'application complète via le navigateur
```

---

### SLIDE 3 : Jasmine - Syntaxe de Base

**Concepts théoriques :**

Jasmine est le framework de test par défaut d'Angular.

```typescript
// Structure basique d'une suite de tests
describe('Nom de la suite', () => {
  // Setup avant chaque test
  beforeEach(() => {
    // Initialisation
  });

  // Setup une seule fois avant tous les tests
  beforeAll(() => {
    // Initialisation globale
  });

  // Test unitaire
  it('doit faire quelque chose', () => {
    // Arrange : préparer les données
    const value = 42;

    // Act : exécuter l'action
    const result = multiply(value, 2);

    // Assert : vérifier le résultat
    expect(result).toBe(84);
  });

  // Test asynchrone
  it('doit gérer les promesses', async () => {
    const result = await asyncFunction();
    expect(result).toBe('valeur attendue');
  });

  // Cleanup après chaque test
  afterEach(() => {
    // Nettoyage
  });

  // Cleanup après tous les tests
  afterAll(() => {
    // Nettoyage global
  });
});

// Matchers courants
expect(value).toBe(42);                    // Égalité stricte (===)
expect(value).toEqual({ x: 1 });         // Égalité profonde
expect(value).toBeTruthy();               // Truthy
expect(value).toBeFalsy();                // Falsy
expect(array).toContain(item);            // Contient
expect(func).toThrow();                   // Lève une exception
expect(func).toThrowError(Error);         // Lève une erreur spécifique
expect(string).toMatch(/regex/);          // Correspond au regex
expect(string).toContain('substring');    // Contient du texte
expect(number).toBeGreaterThan(5);        // Plus grand que
expect(number).toBeLessThan(10);          // Moins que
```

**Spies pour mocker :**

```typescript
it('doit appeler une méthode', () => {
  // Créer un objet mock
  const obj = {
    method: () => {}
  };

  // Spier sur la méthode
  spyOn(obj, 'method').and.returnValue(42);

  // Appeler
  const result = obj.method();

  // Vérifier
  expect(result).toBe(42);
  expect(obj.method).toHaveBeenCalled();
  expect(obj.method).toHaveBeenCalledTimes(1);
  expect(obj.method).toHaveBeenCalledWith(arg1, arg2);
});

// Spy qui appelle la vraie méthode
spyOn(obj, 'method').and.callThrough();

// Spy qui retourne une promesse
spyOn(obj, 'method').and.returnValue(Promise.resolve(data));

// Spy qui lève une erreur
spyOn(obj, 'method').and.throwError('Erreur');
```

---

### SLIDE 4 : Tests de Composants avec TestBed

**Concepts théoriques :**

Tester un composant Angular standalone avec TestBed.

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    // Configurer le TestBed (mini-injecteur Angular)
    await TestBed.configureTestingModule({
      imports: [CounterComponent] // Standalone component
    }).compileComponents(); // Compiler les templates

    // Créer une instance du composant
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;

    // Détecter les changements initiaux (initialisation du template)
    fixture.detectChanges();
  });

  it('doit créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('doit initialiser avec 0', () => {
    expect(component.count()).toBe(0);
  });

  it('doit incrémenter le compteur', () => {
    component.incrementer();
    expect(component.count()).toBe(1);
  });

  it('doit afficher le compte dans le template', () => {
    // Changer la valeur
    component.count.set(5);
    // Détecter les changements
    fixture.detectChanges();

    // Accéder à l'élément DOM
    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain('5');
  });

  it('doit appeler incrementer au clic sur le bouton', () => {
    // Espionner la méthode
    spyOn(component, 'incrementer');

    // Trouver et cliquer le bouton
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    // Vérifier que la méthode a été appelée
    expect(component.incrementer).toHaveBeenCalled();
  });

  it('doit émettre un événement lors de l\'incrémentation', (done) => {
    // S'abonner à l'événement
    component.changement.subscribe((value) => {
      expect(value).toBe(1);
      done(); // Signaler que le test est terminé
    });

    // Déclencher l'événement
    component.incrementer();
  });

  it('doit avoir une classe CSS spécifique', () => {
    component.count.set(10);
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.counter-display'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.classList.contains('counter-display')).toBe(true);
  });
});
```

**Accéder aux éléments du template :**

```typescript
// Via nativeElement (accès DOM brut)
const element = fixture.nativeElement.querySelector('button');
element.textContent;           // Accéder au texte
element.click();               // Déclencher un clic
element.value = 'new value';   // Modifier une propriété

// Via DebugElement (façon Angular)
const debugElement = fixture.debugElement.query(By.css('button'));
debugElement.componentInstance; // Instance du composant enfant
debugElement.injector.get(Service); // Accéder aux services injectés
debugElement.nativeElement;     // Accéder au DOM

// Trouver plusieurs éléments
const elements = fixture.debugElement.queryAll(By.css('.item'));
elements.forEach(el => {
  // Vérifier chaque élément
});
```

---

### SLIDE 5 : Tests de Services avec provideHttpClientTesting()

**Concepts théoriques :**

Tester un service HTTP avec les nouveaux providers (Angular 17+).

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodos: Todo[] = [
    { id: 1, titre: 'Task 1', termine: false, dateCreation: new Date() },
    { id: 2, titre: 'Task 2', termine: true, dateCreation: new Date() }
  ];

  beforeEach(() => {
    // Configurer TestBed avec les nouveaux providers
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    // Injecter le service et le mock HTTP
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Important : vérifier qu'il n'y a pas de requêtes en attente
  afterEach(() => {
    httpMock.verify();
  });

  it('doit créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('doit récupérer la liste des todos', () => {
    // S'abonner au service
    service.getTodos().subscribe((todos) => {
      // Vérifier les données
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    // Attendre la requête GET
    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('GET');
    
    // Répondre avec les données mockées
    req.flush(mockTodos);
  });

  it('doit récupérer un todo par ID', () => {
    service.getTodo(1).subscribe((todo) => {
      expect(todo.id).toBe(1);
      expect(todo.titre).toBe('Task 1');
    });

    const req = httpMock.expectOne('/api/todos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos[0]);
  });

  it('doit créer un nouveau todo', () => {
    const newTodo = { titre: 'Task 3', termine: false, dateCreation: new Date() };

    service.createTodo(newTodo).subscribe((todo) => {
      expect(todo.id).toBe(3);
      expect(todo.titre).toBe('Task 3');
    });

    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    
    req.flush({ id: 3, ...newTodo });
  });

  it('doit mettre à jour un todo', () => {
    const updates = { termine: true };

    service.updateTodo(1, updates).subscribe((todo) => {
      expect(todo.termine).toBe(true);
    });

    const req = httpMock.expectOne('/api/todos/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockTodos[0], ...updates });
  });

  it('doit supprimer un todo', () => {
    service.deleteTodo(1).subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne('/api/todos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('doit gérer les erreurs HTTP', () => {
    service.getTodos().subscribe(
      () => fail('devrait avoir échoué'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne('/api/todos');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('doit gérer les erreurs réseau', () => {
    service.getTodos().subscribe(
      () => fail('devrait avoir échoué'),
      (error) => {
        expect(error.error.type).toBe('Network error');
      }
    );

    const req = httpMock.expectOne('/api/todos');
    req.error(new ErrorEvent('Network error'));
  });
});
```

**Points clés de la nouvelle approche :**
- `provideHttpClient()` : fournit HttpClient pour les requêtes
- `provideHttpClientTesting()` : fournit HttpTestingController pour mocker
- API moderne et recommandée (Angular 17+)
- Plus clean que l'ancien HttpClientTestingModule (deprecated)

---

### SLIDE 6 : Tests Asynchrones avec fakeAsync et tick

**Concepts théoriques :**

Tester du code asynchrone facilement.

```typescript
import { fakeAsync, tick, flush, async } from '@angular/core/testing';

describe('Tests Asynchrones', () => {
  // Méthode 1 : fakeAsync + tick (recommandée)
  it('doit gérer les délais avec fakeAsync', fakeAsync(() => {
    let result = '';

    setTimeout(() => {
      result = 'fait';
    }, 1000);

    // Sans tick : result est vide
    expect(result).toBe('');

    // Avancer le temps de 1000ms
    tick(1000);

    // Maintenant : result = 'fait'
    expect(result).toBe('fait');
  }));

  // Méthode 2 : flush (exécute tous les timers)
  it('doit finir tous les timers avec flush', fakeAsync(() => {
    let count = 0;

    setInterval(() => {
      count++;
    }, 100);

    // Sans flush : count = 0
    expect(count).toBe(0);

    // Exécuter tous les timers
    flush();

    // Après flush : les timers ont été exécutés
    expect(count).toBeGreaterThan(0);
  }));

  // Méthode 3 : Combiner tick et flush
  it('doit combiner tick et flush', fakeAsync(() => {
    let result = '';
    let count = 0;

    setTimeout(() => {
      result = 'timeout';
    }, 500);

    setInterval(() => {
      count++;
    }, 100);

    // Avancer de 300ms
    tick(300);
    expect(result).toBe(''); // Pas d'effet encore
    expect(count).toBe(3);   // 3 intervalles

    // Exécuter tous les timers restants
    flush();
    expect(result).toBe('timeout');
    expect(count).toBeGreaterThan(3);
  }));

  // Méthode 4 : Observables avec fakeAsync
  it('doit gérer les observables avec délai', fakeAsync(() => {
    let value = 0;

    timer(1000).subscribe(() => {
      value = 42;
    });

    tick(1000);
    expect(value).toBe(42);
  }));

  // Méthode 5 : Promesses
  it('doit gérer les promesses', fakeAsync(() => {
    let value = 0;

    Promise.resolve().then(() => {
      value = 99;
    });

    tick(); // Exécuter les microtasks (promesses)
    expect(value).toBe(99);
  }));

  // Méthode 6 : async (ancien style, deprecated)
  it('doit gérer les promesses avec async', async () => {
    const promise = Promise.resolve('valeur');
    const result = await promise;
    expect(result).toBe('valeur');
  });

  // Méthode 7 : done callback (style traditionnel)
  it('doit utiliser done callback', (done) => {
    const observable$ = of(42);

    observable$.subscribe((value) => {
      expect(value).toBe(42);
      done(); // Signaler la fin du test
    });
  });
});
```

---

### SLIDE 7 : Couverture de Code et CI/CD

**Concepts théoriques :**

Mesurer la qualité des tests avec la couverture.

```bash
# Générer un rapport de couverture
ng test --code-coverage --no-watch

# Les rapports se trouvent dans coverage/
# Ouvrir coverage/index.html dans le navigateur
```

**Métriques de couverture :**

```
COUVERTURE DE CODE
──────────────────

Statements (Lignes)
├─ Pourcentage de lignes exécutées
└─ Objectif : 80%+

Branches (Chemins)
├─ Pourcentage de if/else testés
└─ Objectif : 75%+

Functions (Fonctions)
├─ Pourcentage de fonctions testées
└─ Objectif : 80%+

Lines (Lignes)
├─ Pourcentage de lignes testées
└─ Objectif : 80%+
```

**Configuration de couverture minimale :**

```typescript
// karma.conf.js
coverageReporter: {
  dir: require('path').join(__dirname, './coverage'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' },
    { type: 'lcovonly' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
}
```

**Intégration CI/CD avec GitHub Actions :**

```yaml
# .github/workflows/tests.yml
name: Tests et Couverture

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install

      # Lancer les tests avec couverture
      - run: npm run test -- --no-watch --code-coverage

      # Vérifier le linting
      - run: npm run lint

      # Upload la couverture
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
```

**Interpréter les rapports de couverture :**

- ✅ Couverture 80%+ : Acceptable
- ⚠️ Couverture 50-80% : À améliorer
- ❌ Couverture <50% : Inacceptable

---

### SLIDE 8 : Vitest - Alternative Moderne à Karma

**Concepts théoriques :**

Vitest est une alternative plus rapide et moderne à Karma.

```bash
# Installation
npm install -D vitest @vitest/ui

# Configuration vitest.config.ts
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});

# Commandes
npm run test              # Mode watch
npm run test -- --run    # Une seule fois
npm run test:ui          # Interface graphique
npm run test:coverage    # Rapport couverture
```

**Comparaison Karma vs Vitest :**

```
KARMA + JASMINE          VITEST
────────────────         ──────
Temps : 5-10s            Temps : 1-2s
Traditionnel             Moderne
Chrome requis            Multiplatform
Complexe                 Simple
Karma server             Vite dev server
Legacy                   ESM native
```

**Syntaxe Vitest (identique à Jasmine) :**

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('MonService', () => {
  let service: MonService;

  beforeEach(() => {
    service = new MonService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('doit faire quelque chose', () => {
    expect(service.method()).toBe(42);
  });

  it('doit mocker une fonction', () => {
    const mock = vi.fn().mockReturnValue(10);
    expect(mock()).toBe(10);
    expect(mock).toHaveBeenCalled();
  });

  it('doit espionner une méthode', () => {
    const spy = vi.spyOn(service, 'method');
    service.method();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
```

**Avantages de Vitest :**
- ✅ Très rapide (Vite)
- ✅ HMR (Hot Module Reload)
- ✅ Interface UI
- ✅ Couverture intégrée
- ✅ Compatible Jasmine
- ✅ Moderne (ESM)

---

### SLIDE 9 : Travaux Pratiques - Tests Complets

**EXERCICE 1 : Tests Unitaires Complets**

**Durée : 1h**

**ÉNONCÉ :**

Vous avez une application Todo créée aux jours précédents avec :
- `TodoService` : service avec HttpClient pour les requêtes CRUD
- `TodoItemComponent` : composant affichant un item todo
- `TodoListComponent` : composant listant et gérant les items

**Votre mission : Écrire des tests complets**

1. **Tester TodoService** (15 min)
   - Vérifier que `getTodos()` envoie un GET
   - Vérifier que `createTodo()` envoie un POST
   - Vérifier que `updateTodo()` envoie un PUT
   - Vérifier que `deleteTodo()` envoie un DELETE
   - Vérifier la gestion d'erreur HTTP (404, 500)

2. **Tester TodoItemComponent** (20 min)
   - Le composant se crée correctement
   - Le titre du todo s'affiche dans le template
   - La classe CSS "termine" est appliquée si complété
   - Cliquer checkbox émet l'événement `bascule`
   - Cliquer bouton supprimer émet l'événement `suppression`

3. **Tester TodoListComponent** (20 min)
   - `getTodos()` est appelé à l'initialisation
   - Les todos s'affichent dans la liste
   - Ajouter un todo crée et ajoute à la liste
   - Supprimer demande confirmation puis supprime
   - Les erreurs API s'affichent

4. **Commandes à exécuter :**

```bash
# Lancer les tests en mode watch
ng test

# Lancer une seule fois
ng test --no-watch

# Générer le rapport de couverture
ng test --code-coverage --no-watch

# Vérifier la couverture
# Ouvrir : coverage/index.html
```

**Attendus :**
- ✅ Tous les tests passent (couleur verte)
- ✅ Couverture code > 80%
- ✅ Pas d'erreurs ou warnings
- ✅ Services mockés correctement
- ✅ Requêtes HTTP interceptées

---

**Fichier 1 : `src/app/services/todo.service.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/todos';

  const mockTodos: Todo[] = [
    { id: 1, titre: 'Task 1', termine: false, dateCreation: new Date() },
    { id: 2, titre: 'Task 2', termine: true, dateCreation: new Date() }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getTodos', () => {
    it('doit récupérer tous les todos', () => {
      service.getTodos().subscribe((todos) => {
        expect(todos.length).toBe(2);
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos);
    });

    it('doit gérer les erreurs 500', () => {
      service.getTodos().subscribe(
        () => fail('devrait avoir échoué'),
        (error) => expect(error.status).toBe(500)
      );

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('createTodo', () => {
    it('doit créer un nouveau todo', () => {
      const newTodo = { titre: 'Task 3', termine: false, dateCreation: new Date() };
      
      service.createTodo(newTodo).subscribe((todo) => {
        expect(todo.id).toBe(3);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ id: 3, ...newTodo });
    });
  });

  describe('updateTodo', () => {
    it('doit mettre à jour un todo', () => {
      service.updateTodo(1, { termine: true }).subscribe((todo) => {
        expect(todo.termine).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({ ...mockTodos[0], termine: true });
    });
  });

  describe('deleteTodo', () => {
    it('doit supprimer un todo', () => {
      service.deleteTodo(1).subscribe(() => {
        expect(true).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
```

**Fichier 2 : `src/app/components/todo-item/todo-item.component.spec.ts`**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { By } from '@angular/platform-browser';
import { Todo } from '../../models/todo';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  const mockTodo: Todo = {
    id: 1,
    titre: 'Test Task',
    termine: false,
    dateCreation: new Date('2024-01-15')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });

  it('doit créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher le titre du todo', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.textContent).toContain('Test Task');
  });

  it('doit avoir une classe "termine" si complété', () => {
    component.todo = { ...mockTodo, termine: true };
    fixture.detectChanges();

    const li = fixture.debugElement.query(By.css('li'));
    expect(li.nativeElement.classList.contains('termine')).toBe(true);
  });

  it('doit émettre bascule au clic checkbox', () => {
    spyOn(component.bascule, 'emit');

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    checkbox.nativeElement.click();

    expect(component.bascule.emit).toHaveBeenCalled();
  });

  it('doit émettre suppression au clic bouton', () => {
    spyOn(component.suppression, 'emit');

    const button = fixture.debugElement.query(By.css('.btn-supprimer'));
    button.nativeElement.click();

    expect(component.suppression.emit).toHaveBeenCalled();
  });
});
```

**Fichier 3 : `src/app/components/todo-list/todo-list.component.spec.ts`**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  const mockTodos = [
    { id: 1, titre: 'Task 1', termine: false, dateCreation: new Date() },
    { id: 2, titre: 'Task 2', termine: true, dateCreation: new Date() }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'createTodo',
      'updateTodo',
      'deleteTodo'
    ]);

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  describe('Chargement', () => {
    it('doit charger les todos', () => {
      todoService.getTodos.and.returnValue(of(mockTodos));

      component.ngOnInit();
      fixture.detectChanges();

      expect(todoService.getTodos).toHaveBeenCalled();
    });

    it('doit afficher une erreur', () => {
      todoService.getTodos.and.returnValue(
        throwError(() => new Error('Erreur API'))
      );

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.erreur()).toContain('Erreur');
    });
  });

  describe('Ajouter', () => {
    it('doit valider le formulaire', () => {
      component.nouvelleTache.setValue('');
      expect(component.nouvelleTache.valid).toBe(false);

      component.nouvelleTache.setValue('Nouvelle tâche');
      expect(component.nouvelleTache.valid).toBe(true);
    });

    it('doit créer un todo', () => {
      component.nouvelleTache.setValue('Task 3');
      todoService.createTodo.and.returnValue(
        of({ id: 3, titre: 'Task 3', termine: false, dateCreation: new Date() })
      );

      component.ajouterTache();

      expect(todoService.createTodo).toHaveBeenCalled();
      expect(component.nouvelleTache.value).toBe('');
    });
  });

  describe('Basculer', () => {
    it('doit mettre à jour le statut', () => {
      const todo = mockTodos[0];
      todoService.updateTodo.and.returnValue(
        of({ ...todo, termine: true })
      );

      component.basculerTodo(todo);

      expect(todoService.updateTodo).toHaveBeenCalledWith(
        todo.id,
        jasmine.any(Object)
      );
    });
  });

  describe('Supprimer', () => {
    it('doit demander confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.supprimerTodo(1);

      expect(todoService.deleteTodo).not.toHaveBeenCalled();
    });

    it('doit supprimer après confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      todoService.deleteTodo.and.returnValue(of(undefined));

      component.supprimerTodo(1);

      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
    });
  });
});
```

**Tests à effectuer :**
1. ✅ Lancer `ng test`
2. ✅ Tous les tests passent (vert)
3. ✅ Couverture > 80%
4. ✅ Vérifier `coverage/index.html`

---

### SLIDE 10 : Corrigé TP1 - Points Clés

**EXPLICATIONS DÉTAILLÉES :**

**1. HttpTestingController avec provideHttpClientTesting() :**

```typescript
TestBed.configureTestingModule({
  providers: [
    TodoService,
    provideHttpClient(),
    provideHttpClientTesting()
  ]
});
```

- `provideHttpClient()` : fournit HttpClient
- `provideHttpClientTesting()` : fournit HttpTestingController pour mocker les requêtes
- Nouvelle API moderne (Angular 17+)

**2. HttpTestingController : capturer et répondre aux requêtes :**

```typescript
const req = httpMock.expectOne('/api/todos');
expect(req.request.method).toBe('GET');
expect(req.request.body).toEqual(newTodo);
req.flush(mockData);
```

- `expectOne()` : vérifie qu'une requête a été faite
- `flush()` : répond avec les données mockées
- `httpMock.verify()` : vérifie qu'il n'y a pas de requêtes en attente

**3. Simuler les erreurs HTTP :**

```typescript
const req = httpMock.expectOne('/api/todos');
req.flush('Error', { status: 404, statusText: 'Not Found' });
```

Permet de tester comment le service/composant gère les erreurs.

**4. Organiser les tests par fonctionnalité :**

```typescript
describe('getTodos', () => {
  it('doit récupérer les todos', () => { });
  it('doit gérer les erreurs', () => { });
});

describe('createTodo', () => {
  it('doit créer un nouveau todo', () => { });
});
```

**5. Tester les événements du composant :**

```typescript
spyOn(component.bascule, 'emit');
button.click();
expect(component.bascule.emit).toHaveBeenCalled();
```

Espionner les événements et vérifier qu'ils sont émis correctement.

---

## PAUSE DÉJEUNER (12h30-13h30)

---

## PARTIE 2 : DÉPLOIEMENT ET BONNES PRATIQUES (13h30-16h00)

### SLIDE 11 : Build et Optimisation Production

**Concepts théoriques à présenter :**

Compiler l'application pour la production avec optimisations maximales.

```bash
# Build standard
ng build

# Build production optimisé
ng build --configuration production

# Le résultat est dans dist/
# - index.html
# - main.*.js (bundle minifié)
# - styles.*.css (styles minifiés)
# - runtime.*.js
```

**Optimisations appliquées en production :**

```
BUILD PRODUCTION PIPELINE
─────────────────────────

1. AOT COMPILATION
   ├─ Compilation Ahead-Of-Time
   ├─ Détecte les erreurs early
   └─ Bundle -40% plus petit

2. TREE-SHAKING
   ├─ Supprime le code inutilisé
   ├─ Analysé par esbuild
   └─ Bundle -30-50% plus petit

3. MINIFICATION
   ├─ Compresse le code JavaScript
   ├─ Supprime les espaces et commentaires
   └─ Bundle -60-70% plus petit

4. CODE SPLITTING
   ├─ Lazy loading chunks
   ├─ Chargement à la demande
   └─ Meilleure performance initiale

5. HASHING
   ├─ Noms : main.a1b2c3d4.js
   ├─ Cache busting automatique
   └─ Versions facilement contrôlées

RÉSULTAT FINAL
──────────────
Avant : ~500 KB
Après : ~100-150 KB (gzipped)
```

**Configuration angular.json :**

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

**Analyser le bundle :**

```bash
# Générer les statistiques
ng build --configuration production --stats-json

# Installer l'analyseur
npm install --save-dev webpack-bundle-analyzer

# Analyser
npx webpack-bundle-analyzer dist/stats.json
```

---

### SLIDE 12 : Variables d'Environnement et Configuration

**Concepts théoriques :**

Gérer différentes configurations par environnement.

```typescript
// src/environments/environment.ts (développement)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  logLevel: 'debug',
  enableAnalytics: false
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api',
  logLevel: 'error',
  enableAnalytics: true
};
```

**Utiliser dans l'application :**

```typescript
import { environment } from '../environments/environment';
import { enableDebugTools } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  apiUrl = environment.apiUrl;
  
  constructor() {
    if (!environment.production) {
      console.log('Mode développement');
    }
  }
}

// Au démarrage
if (!environment.production) {
  enableDebugTools(appRef);
}
```

**Avec .env (meilleure pratique) :**

```bash
# .env
API_URL=https://api.example.com
API_KEY=your-key
LOG_LEVEL=error

# .env.local (non commité)
API_URL=http://localhost:3000
LOG_LEVEL=debug
```

**Charger depuis .env :**

```typescript
const apiUrl = process.env['API_URL'] || 'http://localhost:3000';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: 'API_URL', useValue: apiUrl }
  ]
});
```

---

### SLIDE 13 : Options de Déploiement

**Concepts théoriques :**

Plusieurs options pour mettre en production.

```
OPTIONS DE DÉPLOIEMENT
─────────────────────

1. HÉBERGEMENT STATIQUE (SPA)
   ├─ Netlify ✅ (gratuit, meilleur)
   ├─ Vercel ✅ (gratuit)
   ├─ GitHub Pages ✅ (gratuit)
   ├─ AWS S3 + CloudFront
   └─ Cloudflare Pages

2. SERVEUR (VPS)
   ├─ DigitalOcean
   ├─ Linode
   ├─ AWS EC2
   └─ Heroku (fermé)

3. CONTENEURS (Docker)
   ├─ AWS ECS
   ├─ Kubernetes
   └─ Docker Hub

4. SERVERLESS (SSR)
   ├─ AWS Lambda + Amplify
   ├─ Google Cloud Functions
   └─ Firebase Functions

5. HOSTING INTÉGRÉ
   ├─ Firebase Hosting
   ├─ Netlify Functions
   └─ Vercel Functions
```

**Déployer sur Netlify (le plus simple) :**

```bash
# 1. Build production
ng build --configuration production

# 2. Installer Netlify CLI
npm install -g netlify-cli

# 3. Déployer
netlify deploy --prod --dir dist

# Site créé : https://your-app.netlify.app
```

**Connecter GitHub à Netlify (CI/CD auto) :**

```
1. Aller sur netlify.com
2. "Connect to Git" → GitHub
3. Sélectionner le repo
4. Build command: ng build --configuration production
5. Publish directory: dist/
6. Déploiement auto à chaque push sur main
```

**Déployer sur GitHub Pages :**

```bash
# 1. Build avec base href
ng build --configuration production --base-href /repo-name/

# 2. Installer angular-cli-ghpages
npm install -g angular-cli-ghpages

# 3. Déployer
ngh --dir dist/repo-name

# Site : https://username.github.io/repo-name
```

**Déployer sur serveur Nginx :**

```nginx
# /etc/nginx/sites-available/app
server {
    listen 80;
    server_name example.com;

    root /var/www/app/dist;
    index index.html;

    # Cache des assets
    location ~* \.(js|css|png|jpg|gif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # HTTPS
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
}
```

**Déployer avec Docker :**

```dockerfile
# Dockerfile (multi-stage)

# Stage 1 : Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2 : Runtime
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

```bash
# Builder et lancer
docker build -t my-app .
docker run -p 3000:3000 my-app

# Sur Docker Hub
docker tag my-app username/my-app
docker push username/my-app
```

---

### SLIDE 14 : Performance et Core Web Vitals

**Concepts théoriques :**

Mesurer et optimiser les performances.

```
CORE WEB VITALS (2024)
─────────────────────

1. LCP (Largest Contentful Paint)
   ├─ Bon : < 2.5s
   ├─ À améliorer : 2.5s - 4s
   ├─ Mauvais : > 4s
   └─ Optimiser : images, lazy load, caching

2. FID (First Input Delay) → Remplacé par INP
   ├─ Bon : < 100ms
   ├─ À améliorer : 100-300ms
   ├─ Mauvais : > 300ms
   └─ Optimiser : JavaScript, event handlers

3. CLS (Cumulative Layout Shift)
   ├─ Bon : < 0.1
   ├─ À améliorer : 0.1-0.25
   ├─ Mauvais : > 0.25
   └─ Optimiser : dimensions, fonts, images

INP (Interaction to Next Paint) - NOUVEAU
   ├─ Remplace FID en 2024
   ├─ Mesure la réactivité générale
   └─ Bon : < 200ms
```

**Optimisations Angular :**

```typescript
// 1. OnPush Change Detection
@Component({
  selector: 'app-todo-item',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  // Détection change seulement si @Input change
}

// 2. TrackBy dans les boucles
@Component({
  template: `
    @for (item of items; track item.id) {
      <app-item [item]="item"></app-item>
    }
  `
})
export class ListComponent {
  items = [...];
  // Performance 10x meilleure sur grandes listes
}

// 3. Lazy loading des routes
{
  path: 'shop',
  loadChildren: () => import('./shop.module')
}

// 4. Images optimisées
<img
  src="image.jpg"
  srcset="image-small.jpg 480w, image.jpg 1200w"
  sizes="(max-width: 600px) 480px, 1200px"
  loading="lazy"
  alt="Description"
>

// 5. Fonts optimisées
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" href="main-font.woff2" as="font" type="font/woff2" crossorigin>
```

**Tester les performances :**

```bash
# Google Lighthouse
# DevTools → Lighthouse → Analyze page load

# Métriques à checker
- LCP : < 2.5s
- INP : < 200ms
- CLS : < 0.1
- FCP : < 1.8s
- TTFB : < 600ms

# Outils
- WebPageTest
- GTmetrix
- PageSpeed Insights
```

---

### SLIDE 15 : Accessibilité (A11y)

**Concepts théoriques :**

Rendre l'application accessible à tous.

```typescript
// ARIA Labels et Roles
@Component({
  selector: 'app-menu',
  template: `
    <nav
      role="navigation"
      aria-label="Menu principal"
    >
      <button
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="'menu-items'"
      >
        Menu
      </button>

      @if (isOpen) {
        <ul id="menu-items" role="menu">
          @for (item of items) {
            <li role="none">
              <a role="menuitem" [href]="item.url">
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      }
    </nav>
  `
})
export class MenuComponent { }

// Keyboard Navigation
@Component({
  template: `
    <div
      (keydown.enter)="select()"
      (keydown.space)="toggle()"
      (keydown.escape)="close()"
      (keydown.arrow-down)="focusNext()"
      (keydown.arrow-up)="focusPrev()"
      tabindex="0"
      role="button"
      aria-pressed="false"
    >
      Cliquable au clavier
    </div>
  `
})
export class AccessibleButtonComponent { }

// Form Accessibility
@Component({
  template: `
    <label for="email">Email *</label>
    <input
      id="email"
      type="email"
      formControlName="email"
      [attr.aria-invalid]="emailControl?.invalid && emailControl?.touched"
      [attr.aria-describedby]="emailControl?.invalid ? 'email-error' : null"
    >
    @if (emailControl?.invalid && emailControl?.touched) {
      <span id="email-error" role="alert">
        {{ emailControl?.errors?.['email'] }}
      </span>
    }
  `
})
export class FormComponent { }
```

**Checklist Accessibilité WCAG 2.1 :**

```
✅ PERCEPTION
   □ Images : alt text explicite
   □ Couleurs : pas d'info couleur seule
   □ Contraste : ratio 4.5:1 minimum
   □ Média : sous-titres obligatoires

✅ OPÉRATION
   □ Clavier : navigation TAB complète
   □ Focus : visible et logique
   □ Pas de trappes clavier
   □ Pas de scintillement > 3Hz

✅ COMPRÉHENSION
   □ Texte : langage clair
   □ Titres : hiérarchie h1>h2>h3
   □ Listes : bonne structure
   □ Focus : ordre logique

✅ ROBUSTESSE
   □ HTML : valide
   □ ARIA : utilisé correctement
   □ Lecteurs écran : compatibles
   □ Technologie d'assistance : supportée
```

---

### SLIDE 16 : IA Intégrée - Gemini API

**Concepts théoriques :**

Angular 20.2+ permet d'intégrer l'IA nativement.

```typescript
// Installation
// npm install @google/generative-ai

import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

@Injectable({ providedIn: 'root' })
export class AiService {
  private model: any;

  async initialize() {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const client = new GoogleGenerativeAI(
      process.env['GEMINI_API_KEY'] || ''
    );
    this.model = client.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async analyzeImage(base64Image: string): Promise<string> {
    const result = await this.model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      },
      'Décrivez cette image'
    ]);
    return result.response.text();
  }

  async streamResponse(prompt: string) {
    return await this.model.generateContentStream(prompt);
  }
}

// Utilisation dans un composant
@Component({
  selector: 'app-ai-chat',
  standalone: true,
  template: `
    <div class="chat-container">
      <div class="messages">
        @for (msg of messages(); track $index) {
          <div [class]="'message ' + msg.role">
            {{ msg.content }}
          </div>
        }
      </div>

      <div class="input-area">
        <input
          [(ngModel)]="message"
          (keyup.enter)="send()"
          placeholder="Posez une question..."
          [disabled]="isLoading()"
        >
        <button (click)="send()" [disabled]="isLoading()">
          {{ isLoading() ? 'Réflexion...' : 'Envoyer' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container { display: flex; flex-direction: column; }
    .messages { flex: 1; overflow-y: auto; }
    .message { padding: 10px; margin: 5px; border-radius: 5px; }
    .message.user { background: #007bff; color: white; }
    .message.assistant { background: #e9ecef; }
  `]
})
export class AiChatComponent implements OnInit {
  aiService = inject(AiService);
  message = '';
  messages = signal<Array<{ role: string; content: string }>>([]);
  isLoading = signal(false);

  async ngOnInit() {
    await this.aiService.initialize();
  }

  async send() {
    if (!this.message.trim()) return;

    this.messages.update(m => [
      ...m,
      { role: 'user', content: this.message }
    ]);

    this.isLoading.set(true);

    try {
      const response = await this.aiService.generateText(this.message);
      this.messages.update(m => [
        ...m,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Erreur IA:', error);
      this.messages.update(m => [
        ...m,
        { role: 'error', content: 'Erreur lors de la requête IA' }
      ]);
    } finally {
      this.isLoading.set(false);
      this.message = '';
    }
  }
}
```

---

### SLIDE 17 : Travaux Pratiques - Build et Déploiement

**EXERCICE 2 : Build Production et Déploiement**

**Durée : 1h30**

**Étape 1 : Préparer la configuration :**

```bash
# Vérifier la configuration
cat src/environments/environment.prod.ts

# S'assurer que les URLs API sont correctes
# S'assurer que les clés sont non hardcodées
```

**Étape 2 : Builder la production :**

```bash
# Nettoyer les builds antérieurs
rm -rf dist/

# Build production
ng build --configuration production

# Vérifier la taille du bundle
du -sh dist/
# Typiquement : 100-200 KB gzipped
```

**Étape 3 : Configuration Nginx :**

Créer `nginx.conf`:

```nginx
events { worker_connections 1024; }

http {
  gzip on;
  gzip_types text/plain text/css application/javascript;

  server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Cache des assets
    location ~* \.(js|css|png|jpg|gif|ico|woff2?)$ {
      expires 365d;
      add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

**Étape 4 : Dockerfile :**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Étape 5 : Build Docker et test local :**

```bash
# Builder l'image
docker build -t my-app:latest .

# Tester localement
docker run -p 3000:80 my-app:latest

# Accéder à http://localhost:3000
```

**Étape 6 : GitHub Actions CI/CD :**

Créer `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test -- --no-watch --code-coverage
      - run: npm run build -- --configuration production
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: dist
      - uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: '.'
          production-branch: main
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Étape 7 : Checklist pré-déploiement :**

```
PRE-DEPLOYMENT CHECKLIST
────────────────────────

✅ Code Quality
   □ npm run lint (0 erreurs)
   □ npm run test (tous passent)
   □ Couverture > 80%

✅ Build
   □ ng build --configuration production (succès)
   □ Pas d'erreurs/warnings
   □ Bundle size < 200KB

✅ Configuration
   □ environment.prod.ts correct
   □ API URLs valides
   □ Pas de secrets en dur

✅ Performance
   □ Lighthouse > 90
   □ LCP < 2.5s
   □ INP < 200ms
   □ CLS < 0.1

✅ Accessibilité
   □ WCAG AA compliant
   □ Keyboard nav OK
   □ Screen reader tested

✅ Security
   □ HTTPS enabled
   □ CSP headers configured
   □ No XSS vulnerabilities
   □ Dependencies audited

✅ Monitoring
   □ Error logging configured
   □ Analytics enabled
   □ Performance monitoring ready
```

---

### SLIDE 18 : Corrigé TP2 - Points Clés

**EXPLICATIONS DÉTAILLÉES :**

**1. Build production avec esbuild :**

```bash
ng build --configuration production
```

- AOT compilation automatique
- Tree-shaking supprime le code inutilisé (import non utilisés)
- Minification de tous les assets
- Hashing des noms de fichiers pour le cache busting

**2. Dockerfile multi-stage :**

Stage 1 (Builder) : crée le bundle (~500MB avec node_modules)
Stage 2 (Runtime) : sert l'app (~150MB avec nginx)
Résultat : ~250MB d'image, plus 80MB de cache layers

**3. Nginx try_files pour SPA :**

```nginx
try_files $uri $uri/ /index.html;
```

Redirige toutes les routes vers index.html pour que Angular Router gère la navigation.

**4. Cache busting automatique :**

Fichiers avec hash → peuvent être mis en cache 1 an
Sans hash → doivent être revalidés à chaque chargement

**5. GitHub Actions CI/CD :**

- Automatise tests → build → déploiement
- À chaque push sur main : test, build, déploiement
- Zéro manipulation manuelle

---

### SLIDE 20 : Résumé Jour 4 et Formation Complète

**Ce que vous avez appris Jour 4 :**

✅ **Tests Complets :**
- Tests unitaires de services (HttpClientTestingModule)
- Tests de composants (TestBed, DebugElement)
- Tests asynchrones (fakeAsync, tick, flush)
- Mocking et spies
- Couverture de code (80%+)
- CI/CD avec GitHub Actions

✅ **Build et Optimisation :**
- Production build avec esbuild
- AOT compilation
- Tree-shaking et minification
- Code splitting et lazy loading
- Analyse du bundle

✅ **Configuration :**
- Variables d'environnement
- Fichiers .env
- Configuration par environnement

✅ **Déploiement :**
- Netlify (statique, le plus simple)
- GitHub Pages
- Serveur Nginx
- Docker multi-stage
- GitHub Actions CI/CD

✅ **Performance :**
- Core Web Vitals (LCP, INP, CLS)
- OnPush change detection
- TrackBy pour les boucles
- Lighthouse audit (90+)

✅ **Accessibilité (A11y) :**
- ARIA labels et roles
- Navigation au clavier
- Contraste et lisibilité
- WCAG 2.1 compliance

✅ **IA Intégrée :**
- Gemini API
- Chat intelligent
- Génération de contenu

---

### SLIDE 21 : Résumé Formation Complète 4 Jours

**FORMATION ANGULAR 20 - COMPLET (27h)**

```
JOUR 1 : FONDAMENTAUX (7h)
════════════════════════════
├─ TypeScript moderne
│  └─ Classes, modules, types, décorateurs
├─ Composants Angular
│  └─ Templates, data binding, événements
├─ Directives & Pipes
│  └─ @if, @for, @switch, built-in pipes
├─ Standalone Components
│  └─ Importation granulaire
└─ 1ère Application : TODO LIST

JOUR 2 : RÉACTIVITÉ & SERVICES (7h)
═════════════════════════════════════
├─ RxJS Observables
│  └─ Opérateurs (map, filter, switchMap)
├─ Signals (API nouvelle)
│  └─ signal, computed, effect
├─ Services & Injection
│  └─ @Injectable, inject, hiérarchie
├─ Formulaires Réactifs
│  └─ FormGroup, validation
├─ Cycle de vie & Décorateurs
│  └─ OnInit, ViewChild, Output Signal
└─ 2e Application : GESTION PRODUITS

JOUR 3 : ROUTING & HTTP (7h)
══════════════════════════════
├─ Routage multi-pages
│  └─ Routes, paramètres, lazy loading
├─ Route Guards & Resolvers
│  └─ CanActivate, CanDeactivate
├─ HttpClient & API
│  └─ GET/POST/PUT/DELETE
├─ Intercepteurs
│  └─ Auth, Logging, Erreurs
├─ Authentification JWT
│  └─ Token management
├─ SSR & Hydration
│  └─ Server-Side Rendering
└─ 3e Application : BLOG + API

JOUR 4 : TESTS & PRODUCTION (6h)
═════════════════════════════════
├─ Tests Unitaires
│  └─ Jasmine, TestBed, HttpClientTestingModule
├─ Tests Asynchrones
│  └─ fakeAsync, tick, flush
├─ Couverture de Code
│  └─ 80%+ coverage, CI/CD
├─ Build Production
│  └─ AOT, tree-shaking, minification
├─ Déploiement
│  └─ Netlify, Nginx, Docker
├─ Performance
│  └─ Core Web Vitals, Lighthouse 90+
├─ Accessibilité
│  └─ WCAG 2.1, keyboard nav
└─ IA : Gemini API

════════════════════════════════════════════════════════════════

TECHNOLOGIES MAÎTRISÉES
════════════════════════

Frontend
├─ Angular 20 (framework)
├─ TypeScript 5 (langage)
├─ RxJS (réactivité)
├─ Signals (API moderne)
├─ Reactive Forms (formulaires)
├─ Routing (navigation)
└─ Standalone Components (architecture)

Backend Integration
├─ HttpClient (requêtes)
├─ Intercepteurs (middleware)
├─ Authentication JWT
├─ Error handling robuste
└─ API REST complète

Quality
├─ Jasmine (tests unitaires)
├─ TestBed (tests composants)
├─ HttpClientTestingModule (mock HTTP)
├─ 80%+ code coverage
└─ GitHub Actions (CI/CD)

Production
├─ Build optimization (esbuild)
├─ Tree-shaking & minification
├─ Code splitting & lazy loading
├─ Docker containerization
├─ Nginx deployment
└─ Performance monitoring

Advanced
├─ SSR (Server-Side Rendering)
├─ Hydration progressive
├─ Performance (Core Web Vitals)
├─ Accessibility (WCAG 2.1)
└─ AI Integration (Gemini)

════════════════════════════════════════════════════════════════

3 APPLICATIONS COMPLÈTES CRÉÉES
════════════════════════════════

1. TODO LIST (Jour 1)
   ├─ Composants standalone
   ├─ Data binding
   ├─ Formulaires réactifs
   └─ Services

2. GESTION PRODUITS (Jour 2)
   ├─ Services avec Signals
   ├─ Formulaires avancés
   ├─ Validation complète
   └─ Multi-composants

3. BLOG + API (Jour 3)
   ├─ Routage multi-pages
   ├─ Lazy loading routes
   ├─ Requêtes HTTP
   ├─ Intercepteurs
   └─ Authentification

════════════════════════════════════════════════════════════════

CERTIFICAT DE MAÎTRISE ANGULAR 20
═════════════════════════════════

✅ Créer des applications scalables
✅ Tester complètement (80%+)
✅ Déployer en production
✅ Optimiser les performances
✅ Assurer l'accessibilité
✅ Gérer l'authentification
✅ Intégrer des APIs
✅ Utiliser l'IA
```

---

**Prochaines Étapes Recommandées :**

```
PROGRESSION APRÈS FORMATION
════════════════════════════

SEMAINE 1-2 : CONSOLIDATION
├─ Refaire les exercices sans aide
├─ Créer votre propre projet
├─ Contribuer à un projet open-source
└─ Approfondir la documentation

SEMAINE 3-4 : APPROFONDISSEMENTS
├─ State Management (NgRx)
├─ Advanced RxJS patterns
├─ E2E Testing (Cypress/Playwright)
├─ Web Security
└─ Advanced TypeScript

MOIS 2-3 : SPÉCIALISATIONS
├─ Micro-frontends (Module Federation)
├─ Monorepo (Nx)
├─ Advanced SSR
├─ GraphQL integration
└─ Real-time (WebSocket)

LONG TERME : EXPERTISE
├─ Architecture d'entreprise
├─ Performance optimization
├─ Infrastructure (Docker, K8s)
├─ DevOps practices
└─ Team leadership
```

**Ressources Officielles :**

```
DOCUMENTATION & COMMUNAUTÉ
═══════════════════════════

Angular
├─ https://angular.io/docs
├─ https://blog.angular.io
└─ Angular Discord Server

TypeScript
├─ https://www.typescriptlang.org/docs
└─ TypeScript Handbook

RxJS
├─ https://rxjs.dev
└─ RxJS Operator Decision Tree

Testing
├─ https://jasmine.github.io
└─ https://vitest.dev

Deployment
├─ https://netlify.com/docs
├─ https://vercel.com/docs
└─ https://nginx.org/docs

Performance
├─ https://web.dev/performance
├─ https://lighthouse.dev
└─ https://pagespeed.web.dev
```

---

## ANNEXE : CHEAT SHEET JOUR 4

### Tests - Jasmine

```typescript
describe('Suite', () => {
  beforeEach(() => { /* Setup */ });
  it('test', () => {
    expect(value).toBe(42);
  });
});

// Matchers courants
expect(x).toBe(y)
expect(x).toEqual(y)
expect(x).toBeTruthy()
expect(array).toContain(item)
expect(fn).toThrow()

// Spies
spyOn(obj, 'method')
expect(obj.method).toHaveBeenCalled()
expect(obj.method).toHaveBeenCalledWith(arg)
```

### Tests - Angular

```typescript
// Nouveau style (Angular 17+)
TestBed.configureTestingModule({
  providers: [
    Service,
    provideHttpClient(),
    provideHttpClientTesting()
  ]
});

fixture = TestBed.createComponent(Component);
component = fixture.componentInstance;
fixture.detectChanges();

// HTTP Mock (nouveau)
const httpMock = TestBed.inject(HttpTestingController);
httpMock.expectOne('/api')
req.flush(data)
httpMock.verify()

// HTTP Mock (ancien - deprecated)
// HttpClientTestingModule n'est plus recommandé
```

### Build & Deployment

```bash
# Build
ng build --configuration production

# Docker
docker build -t app .
docker run -p 3000:80 app

# Netlify
netlify deploy --prod --dir dist

# GitHub Pages
ng build --base-href /repo/
ngh --dir dist/repo
```

### Performance

```typescript
// OnPush
ChangeDetectionStrategy.OnPush

// TrackBy
@for (item of items; track item.id)

// Lazy loading
loadChildren: () => import('./module')
```

### IA - Gemini API

```typescript
const { GoogleGenerativeAI } = await import('@google/generative-ai');
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent("prompt");
const text = result.response.text();
```

---

## ANNEXE : COMMANDES CLI FINALES

```bash
# Génération
ng g c component-name
ng g s service-name
ng g guard guard-name

# Tests
ng test
ng test --code-coverage --no-watch

# Build
ng build
ng build --configuration production

# Deployment
ng build --base-href /repo/
netlify deploy --prod --dir dist

# Docker
docker build -t myapp .
docker run -p 3000:80 myapp
```

---

## 🎓 CERTIFICAT DE FORMATION

```
╔══════════════════════════════════════════════════════════════╗
║          FORMATION ANGULAR 20 - CERTIFICAT                 ║
║                     (4 Jours - 27 Heures)                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Vous avez maîtrisé :                                       ║
║                                                              ║
║  ✅ Angular Framework (composants, services, routing)       ║
║  ✅ TypeScript Avancé (types, décorateurs, patterns)        ║
║  ✅ Programmation Réactive (RxJS, Signals)                  ║
║  ✅ Formulaires Réactifs (validation, gestion d'état)       ║
║  ✅ Communication HTTP (APIs, intercepteurs, auth)          ║
║  ✅ Tests Complets (>80% couverture)                        ║
║  ✅ Build Production (optimisations, performances)          ║
║  ✅ Déploiement (Netlify, Docker, Nginx)                    ║
║  ✅ Accessibilité (WCAG 2.1, keyboard navigation)           ║
║  ✅ IA Integration (Gemini API)                             ║
║                                                              ║
║  Vous êtes capable de :                                     ║
║                                                              ║
║  ✅ Créer des applications scalables et maintenables        ║
║  ✅ Écrire des tests complets et fiables                    ║
║  ✅ Optimiser les performances et l'accessibilité           ║
║  ✅ Déployer en production avec confidence                  ║
║  ✅ Travailler en équipe sur des projets complexes          ║
║                                                              ║
║  Prêt pour :                                                ║
║                                                              ║
║  ✅ Projets en production                                   ║
║  ✅ Équipes d'entreprise                                    ║
║  ✅ Architectures scalables                                 ║
║  ✅ Microservices frontend                                  ║
║  ✅ Applications d'envergure                                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║              FORMATION COMPLÉTÉE AVEC SUCCÈS                ║
║                                                              ║
║         Bonne chance dans votre parcours Angular ! 🚀       ║
╚══════════════════════════════════════════════════════════════╝
```

---

**FIN DE LA FORMATION ANGULAR 20 COMPLÈTE**

*4 Jours • 27 Heures • 3 Applications • 100+ Tests*
*Production-Ready • Enterprise-Grade • AI-Enabled*

**Vous êtes maintenant un développeur Angular moderne et compétent ! 🎉**