# Formation Angular 20 - Jour 3
## Programme Complet : Routing & Requêtes HTTP

---

## PARTIE 1 : ROUTING ET NAVIGATION (9h00-12h30)

### SLIDE 1 : Accueil et Récapitulatif Jours 1-2

**Contenu à présenter :**

Bienvenue au Jour 3 ! Les deux premiers jours, vous avez appris les fondamentaux et la réactivité.

**Récapitulatif rapide :**
- Jour 1 : TypeScript, Composants, Data Binding
- Jour 2 : Réactivité, Signals, Services, Formulaires

**Aujourd'hui :**
- Routage et navigation multi-pages
- Requêtes HTTP vers des APIs
- Intercepteurs et authentification
- Nouvelle API Resource
- SSR et hydration progressive
- Communication API complète

**Objectif :** Transformer votre application en SPA (Single Page Application) avec backend.

---

### SLIDE 2 : Configuration du Router - Routes Basiques

**Concepts théoriques à présenter :**

Le routeur gère la navigation dans une SPA sans rechargement.

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProduitListComponent } from './pages/produit-list/produit-list.component';
import { ProduitDetailComponent } from './pages/produit-detail/produit-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  // Route par défaut
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Routes simples
  { path: 'home', component: HomeComponent },
  { path: 'produits', component: ProduitListComponent },

  // Route avec paramètre
  { path: 'produit/:id', component: ProduitDetailComponent },

  // Wildcard (catch-all)
  { path: '**', component: NotFoundComponent }
];
```

**Bootstrap avec routes :**

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
```

**Utiliser RouterOutlet dans le composant racine :**

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav>Navigation ici</nav>
    <router-outlet></router-outlet>
    <footer>Footer ici</footer>
  `
})
export class AppComponent { }
```

**Concepts clés :**
- `RouterOutlet` : Où les composants de route s'affichent
- `pathMatch: 'full'` : Route exacte
- `**` : Wildcard (doit être en dernier)

---

### SLIDE 3 : Navigation et RouterLink

**Concepts théoriques :**

RouterLink permet la navigation sans recharger la page.

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <!-- Navigation simple -->
      <a routerLink="/home">Accueil</a>
      <a routerLink="/produits">Produits</a>

      <!-- Navigation avec paramètres -->
      <a [routerLink]="['/produit', 123]">Produit 123</a>

      <!-- Navigation avec query params -->
      <a [routerLink]="'/produits'" [queryParams]="{ category: 'electronics', sort: 'price' }">
        Électronique
      </a>

      <!-- Classe active automatique -->
      <a
        routerLink="/home"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        Accueil
      </a>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 20px;
      padding: 15px;
      background-color: #333;
    }

    a {
      color: white;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 4px;
    }

    a:hover {
      background-color: #555;
    }

    a.active {
      background-color: #007bff;
    }
  `]
})
export class NavbarComponent { }
```

**Navigation programmatique :**

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <button (click)="allerAccueil()">Aller à l'accueil</button>
    <button (click)="allerProduit(5)">Voir produit 5</button>
  `
})
export class DemoComponent {
  private router = inject(Router);

  allerAccueil() {
    this.router.navigate(['/home']);
  }

  allerProduit(id: number) {
    this.router.navigate(['/produit', id]);
  }

  allerAvecParams() {
    this.router.navigate(
      ['/produits'],
      { queryParams: { category: 'electronics' } }
    );
  }
}
```

---

### SLIDE 4 : Paramètres de Route et ActivatedRoute

**Concepts théoriques :**

Accéder aux paramètres et query params dans un composant.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-produit-detail',
  standalone: true,
  template: `
    <div>
      <h1>Produit {{ produitId() }}</h1>
      <p>Catégorie filtrée : {{ categorie() }}</p>
      <p>Tri : {{ tri() }}</p>
    </div> `
})
export class ProduitDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  produitId = signal<string>('');
  categorie = signal<string>('');
  tri = signal<string>('');

  ngOnInit() {
    // Méthode 1 : Observer les paramètres
    this.route.paramMap.subscribe(params => {
      this.produitId.set(params.get('id') || '');
    });

    // Méthode 2 : Observer les query params
    this.route.queryParamMap.subscribe(params => {
      this.categorie.set(params.get('category') || 'tous');
      this.tri.set(params.get('sort') || 'nom');
    });
  }

  // Moderne avec Signals
  id$ = this.route.paramMap.pipe(
    map(params => params.get('id') || '')
  );

  id = toSignal(this.id$, { initialValue: '' });
}
```

**Snapshot (accès ponctuel) :**

```typescript
@Component({...})
export class ProduitDetailComponent {
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Accès immédiat (si les params ne changent pas)
    const id = this.route.snapshot.paramMap.get('id');
    const category = this.route.snapshot.queryParamMap.get('category');

    console.log('ID :', id);
    console.log('Catégorie :', category);
  }
}
```

---

### SLIDE 5 : Routes Imbriquées et Outlet Nommés

**Concepts théoriques :**

Créer des hiérarchies de routes pour des layouts complexes.

```typescript
// Routes imbriquées (children)
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

// Utilisation dans AdminLayoutComponent
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="admin-container">
      <aside class="sidebar">
        <a routerLink="/admin/dashboard">Dashboard</a>
        <a routerLink="/admin/users">Utilisateurs</a>
        <a routerLink="/admin/settings">Paramètres</a>
      </aside>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent { }
```

**Outlets nommés :**

```typescript
// Routes
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'sidebar', component: SidebarComponent, outlet: 'side' },
      { path: 'help', component: HelpComponent, outlet: 'help' }
    ]
  }
];

// Template avec plusieurs outlets
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="layout">
      <header></header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <aside>
        <router-outlet name="side"></router-outlet>
      </aside>
      <div class="help">
        <router-outlet name="help"></router-outlet>
      </div>
    </div>
  `
})
export class MainLayoutComponent { }

// Navigation vers outlets nommés
this.router.navigate([{ outlets: {
  primary: ['products'],
  side: ['sidebar'],
  help: ['help']
}}]);
```

---

### SLIDE 6 : Route Guards - Protection des Routes

**Concepts théoriques :**

Les guards protègent l'accès aux routes (authentification, permissions, etc.).

```typescript
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Guard en tant que fonction (moderne)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Accès autorisé
  }

  // Rediriger vers login
  router.navigate(['/login']);
  return false;
};

// Utilisation dans les routes
export const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent }
];
```

**Types de guards :**

```typescript
import {
  CanActivateFn,
  CanDeactivateFn,
  CanMatchFn,
  ResolveFn
} from '@angular/router';

// canActivate : Contrôler l'entrée d'une route
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.hasRole('admin') ? true : false;
};

// canDeactivate : Confirmer avant de quitter
export const unsavedChangesGuard: CanDeactivateFn<any> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.hasUnsavedChanges()) {
    return confirm('Vous avez des modifications non sauvegardées. Continuer ?');
  }
  return true;
};

// resolve : Charger les données avant d'afficher la route
export const productResolver: ResolveFn<Product> = (route, state) => {
  const id = route.paramMap.get('id');
  return inject(ProductService).getProduct(id);
};

// Utilisation dans les routes
export const routes: Routes = [
  {
    path: 'produit/:id',
    component: ProduitDetailComponent,
    resolve: { produit: productResolver },
    canDeactivate: [unsavedChangesGuard]
  }
];

// Accéder aux données résolues
@Component({...})
export class ProduitDetailComponent {
  route = inject(ActivatedRoute);

  ngOnInit() {
    const produit = this.route.snapshot.data['produit'];
    console.log(produit);
  }
}
```

---

### SLIDE 7 : Route Inputs (Angular 17+)

**Concepts théoriques :**

Nouvelle API pour passer des données via les routes (remplace paramMap).

```typescript
// Routes avec input binding
export const routes: Routes = [
  {
    path: 'produit/:id',
    component: ProduitDetailComponent,
    data: { title: 'Détail Produit' }
  }
];

// Configuration du inputBinding
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};

// Composant reçoit l'ID directement en input
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-produit-detail',
  standalone: true,
  template: `
    <h1>Produit {{ id() }}</h1>
    <h2>{{ title() }}</h2>
  `
})
export class ProduitDetailComponent {
  id = input<string>('');
  title = input<string>('');
}

// Pas besoin d'ActivatedRoute !
// Angular injecte automatiquement les paramètres
```

**Avantages :**
- Plus simple que paramMap
- Type-safe
- Moins de code
- Meilleure performance

---

### SLIDE 8 : Lazy Loading de Routes

**Concepts théoriques :**

Charger les modules de route à la demande pour réduire le bundle initial.

```typescript
// Lazy loading de routes
export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  // Lazy loading - chargé uniquement quand on navigue vers /admin
  {
    path: 'admin',
    loadChildren: () => import('./routes/admin.routes').then(m => m.adminRoutes)
  },

  // Lazy loading avec component
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component')
      .then(m => m.ProfileComponent)
  }
];

// admin.routes.ts - fichier séparé
import { Routes } from '@angular/router';
import { AdminComponent } from '../pages/admin/admin.component';
import { UsersComponent } from '../pages/users/users.component';

export const adminRoutes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'users', component: UsersComponent }
];
```

**Avantages :**
- Bundle initial réduit (30-50%)
- Temps de chargement initial plus rapide
- Modules chargés à la demande
- Meilleure performance

**Vérification du lazy loading :**

```bash
# Build de production
ng build --configuration production

# Vérifier les bundles dans dist/
# Vous verrez des fichiers séparés pour chaque route lazy
```

---

### SLIDE 9 : TP1 - Blog Multi-Pages avec Routing

**ÉNONCÉ DU TP :**

**Durée : 1h30**

**Objectif :** Créer une application blog avec routing, lazy loading et guards.

**Fonctionnalités attendues :**

1. **Page d'accueil** (`/home`)
   - Liste de 3 derniers articles
   - Bouton "Voir tous les articles"

2. **Page liste articles** (`/blog`)
   - Affichage de tous les articles
   - Barre de recherche
   - Clic sur article → détail

3. **Page détail article** (`/blog/:id`)
   - Affichage complet d'un article
   - Bouton retour

4. **Page admin** (`/admin`)
   - Protégée par guard
   - Formulaire ajout article
   - Liste articles avec suppression

5. **Page 404**
   - Affi chée si route inexistante

**Architecture technique :**

- Routes principales dans `app.routes.ts`
- Lazy loading pour `/blog` et `/admin`
- Guard pour protéger `/admin`
- Service pour gérer les articles (avec signals)

**Données de départ :**

```typescript
// Article interface
interface Article {
  id: number;
  titre: string;
  contenu: string;
  auteur: string;
  date: Date;
}

// 3 articles initiaux fournis par le service
```

**À implémenter :**

1. Structure des routes avec lazy loading
2. Service `BlogService` avec signals
3. Tous les composants pages
4. Navigation entre les pages
5. Recherche d'articles
6. Guard simple (toujours true pour le TP)

**Tests attendus :**
- Navigation entre toutes les pages
- Clic sur article → voir détail
- Recherche d'articles
- Ajout d'article depuis admin
- Suppression d'article
- Page 404 si route inexistante

---

### SLIDE 9 (suite) : TP1 - Correction Complète

**CORRECTION COMPLÈTE :**

**Fichier 1 : `src/app/models/article.ts`**

```typescript
export interface Article {
  id: number;
  titre: string;
  contenu: string;
  auteur: string;
  date: Date;
}
```

**Fichier 2 : `src/app/services/blog.service.ts`**

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private articles = signal<Article[]>([
    {
      id: 1,
      titre: 'Introduction à Angular 20',
      contenu: 'Angular 20 apporte de nombreuses nouveautés...',
      auteur: 'Jean Dupont',
      date: new Date('2024-01-15')
    },
    {
      id: 2,
      titre: 'Les Signals expliqués',
      contenu: 'Les signals sont la nouvelle API de réactivité...',
      auteur: 'Marie Martin',
      date: new Date('2024-01-20')
    },
    {
      id: 3,
      titre: 'Routing avancé',
      contenu: 'Découvrez les techniques avancées de routing...',
      auteur: 'Pierre Durand',
      date: new Date('2024-01-25')
    }
  ]);

  readonly articlesListe = this.articles.asReadonly();
  readonly nombreArticles = computed(() => this.articles().length);

  getArticles() {
    return this.articlesListe();
  }

  getDerniersArticles(limit: number = 3) {
    return this.articles().slice(-limit).reverse();
  }

  getArticleById(id: number): Article | undefined {
    return this.articles().find(a => a.id === id);
  }

  rechercherArticles(terme: string): Article[] {
    if (!terme) return this.articles();
    
    const termeLower = terme.toLowerCase();
    return this.articles().filter(a =>
      a.titre.toLowerCase().includes(termeLower) ||
      a.contenu.toLowerCase().includes(termeLower) ||
      a.auteur.toLowerCase().includes(termeLower)
    );
  }

  ajouterArticle(article: Omit<Article, 'id'>) {
    const nouvelArticle: Article = {
      ...article,
      id: Math.max(...this.articles().map(a => a.id), 0) + 1
    };
    this.articles.update(articles => [...articles, nouvelArticle]);
  }

  supprimerArticle(id: number) {
    this.articles.update(articles => articles.filter(a => a.id !== id));
  }
}
```

**Fichier 3 : `src/app/guards/auth.guard.ts`**

```typescript
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Pour le TP, toujours authorisé
  // En production, vérifier l'authentification
  return true;
};
```

**Fichier 4 : `src/app/components/navbar/navbar.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>Mon Blog Angular</h2>
      </div>
      <div class="nav-links">
        <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Accueil
        </a>
        <a routerLink="/blog" routerLinkActive="active">
          Articles
        </a>
        <a routerLink="/admin" routerLinkActive="active">
          Admin
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }
  `]
})
export class NavbarComponent { }
```

**Fichier 5 : `src/app/pages/home/home.component.ts`**

```typescript
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <h1>Bienvenue sur Mon Blog Angular</h1>
        <p>Découvrez les derniers articles sur le développement web</p>
      </section>

      <section class="derniers-articles">
        <h2>Derniers Articles</h2>
        <div class="articles-grid">
          @for (article of derniersArticles; track article.id) {
            <div class="article-card">
              <h3>{{ article.titre }}</h3>
              <p class="meta">Par {{ article.auteur }} • {{ article.date | date:'dd/MM/yyyy' }}</p>
              <p class="extrait">{{ article.contenu.substring(0, 100) }}...</p>
              <a [routerLink]="['/blog', article.id]" class="btn">Lire la suite</a>
            </div>
          }
        </div>
        <div class="voir-tous">
          <a routerLink="/blog" class="btn-primary">Voir tous les articles</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .derniers-articles h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .articles-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .article-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .article-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .article-card h3 {
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .extrait {
      color: #444;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: #5568d3;
    }

    .voir-tous {
      text-align: center;
    }

    .btn-primary {
      display: inline-block;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: scale(1.05);
    }
  `]
})
export class HomeComponent {
  blogService = inject(BlogService);
  derniersArticles = this.blogService.getDerniersArticles(3);
}
```

**Fichier 6 : `src/app/pages/blog-list/blog-list.component.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="blog-container">
      <h1>Tous les Articles</h1>

      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="rechercher()"
          placeholder="Rechercher un article..."
        />
      </div>

      <div class="articles-list">
        @for (article of articlesAffiches(); track article.id) {
          <div class="article-item">
            <h2>{{ article.titre }}</h2>
            <p class="meta">Par {{ article.auteur }} • {{ article.date | date:'dd/MM/yyyy' }}</p>
            <p class="extrait">{{ article.contenu.substring(0, 200) }}...</p>
            <a [routerLink]="['/blog', article.id]" class="btn">Lire l'article</a>
          </div>
        } @empty {
          <p class="no-results">Aucun article trouvé</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .blog-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .search-box {
      margin-bottom: 2rem;
    }

    .search-box input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 4px;
    }

    .search-box input:focus {
      outline: none;
      border-color: #667eea;
    }

    .articles-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .article-item {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .article-item h2 {
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .extrait {
      color: #444;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: #5568d3;
    }

    .no-results {
      text-align: center;
      color: #999;
      font-size: 1.2rem;
      padding: 3rem;
    }
  `]
})
export class BlogListComponent {
  blogService = inject(BlogService);
  searchTerm = '';
  articlesAffiches = signal(this.blogService.getArticles());

  rechercher() {
    this.articlesAffiches.set(
      this.blogService.rechercherArticles(this.searchTerm)
    );
  }
}
```

**Fichier 7 : `src/app/pages/blog-detail/blog-detail.component.ts`**

```typescript
import { Component, inject, input, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (article()) {
      <div class="detail-container">
        <button class="btn-back" (click)="retour()">← Retour</button>
        
        <article class="article-detail">
          <h1>{{ article()!.titre }}</h1>
          <p class="meta">
            Par {{ article()!.auteur }} • {{ article()!.date | date:'dd/MM/yyyy' }}
          </p>
          <div class="contenu">
            {{ article()!.contenu }}
          </div>
        </article>

        <div class="actions">
          <a routerLink="/blog" class="btn">Voir tous les articles</a>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <h2>Article non trouvé</h2>
        <a routerLink="/blog" class="btn">Retour aux articles</a>
      </div>
    }
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .btn-back {
      padding: 0.5rem 1rem;
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .btn-back:hover {
      background-color: #e0e0e0;
    }

    .article-detail {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .article-detail h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .meta {
      color: #666;
      font-size: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;
    }

    .contenu {
      color: #444;
      line-height: 1.8;
      font-size: 1.1rem;
    }

    .actions {
      margin-top: 2rem;
      text-align: center;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: #5568d3;
    }

    .not-found {
      text-align: center;
      padding: 4rem 2rem;
    }

    .not-found h2 {
      color: #666;
      margin-bottom: 2rem;
    }
  `]
})
export class BlogDetailComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);

  // Reçoit l'ID depuis la route
  id = input<string>('');

  article = computed(() => {
    const articleId = parseInt(this.id(), 10);
    return this.blogService.getArticleById(articleId);
  });

  retour() {
    this.router.navigate(['/blog']);
  }
}
```

**Fichier 8 : `src/app/pages/admin/admin.component.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <h1>Administration</h1>

      <section class="add-section">
        <h2>Ajouter un article</h2>
        <form [formGroup]="formulaire" (ngSubmit)="ajouterArticle()">
          <div class="form-group">
            <label>Titre</label>
            <input formControlName="titre" />
            @if (titreControl?.invalid && titreControl?.touched) {
              <span class="error">Le titre est requis</span>
            }
          </div>

          <div class="form-group">
            <label>Contenu</label>
            <textarea formControlName="contenu" rows="8"></textarea>
            @if (contenuControl?.invalid && contenuControl?.touched) {
              <span class="error">Le contenu est requis</span>
            }
          </div>

          <div class="form-group">
            <label>Auteur</label>
            <input formControlName="auteur" />
            @if (auteurControl?.invalid && auteurControl?.touched) {
              <span class="error">L'auteur est requis</span>
            }
          </div>

          <button type="submit" [disabled]="formulaire.invalid">
            Publier l'article
          </button>
        </form>
      </section>

      <section class="list-section">
        <h2>Articles existants ({{ blogService.nombreArticles() }})</h2>
        <div class="articles-admin">
          @for (article of blogService.articlesListe(); track article.id) {
            <div class="article-admin-item">
              <div class="article-info">
                <h3>{{ article.titre }}</h3>
                <p>Par {{ article.auteur }} • {{ article.date | date:'dd/MM/yyyy' }}</p>
              </div>
              <button class="btn-delete" (click)="supprimerArticle(article.id)">
                Supprimer
              </button>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .add-section, .list-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    h2 {
      color: #667eea;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .error {
      color: #e74c3c;
      font-size: 0.9rem;
      margin-top: 0.25rem;
      display: block;
    }

    button[type="submit"] {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    button[type="submit"]:hover:not(:disabled) {
      transform: scale(1.02);
    }

    button[type="submit"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .articles-admin {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .article-admin-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .article-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .article-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .btn-delete {
      padding: 0.5rem 1rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-delete:hover {
      background-color: #c0392b;
    }
  `]
})
export class AdminComponent {
  blogService = inject(BlogService);
  router = inject(Router);

  formulaire = new FormGroup({
    titre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    contenu: new FormControl('', [Validators.required, Validators.minLength(20)]),
    auteur: new FormControl('', [Validators.required])
  });

  get titreControl() {
    return this.formulaire.get('titre');
  }

  get contenuControl() {
    return this.formulaire.get('contenu');
  }

  get auteurControl() {
    return this.formulaire.get('auteur');
  }

  ajouterArticle() {
    if (this.formulaire.valid) {
      const { titre, contenu, auteur } = this.formulaire.value;
      this.blogService.ajouterArticle({
        titre: titre!,
        contenu: contenu!,
        auteur: auteur!,
        date: new Date()
      });
      this.formulaire.reset();
      alert('Article ajouté avec succès !');
    }
  }

  supprimerArticle(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.blogService.supprimerArticle(id);
    }
  }
}
```

**Fichier 9 : `src/app/pages/not-found/not-found.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas.</p>
        <a routerLink="/home" class="btn">Retour à l'accueil</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 500px;
    }

    .not-found-content {
      text-align: center;
    }

    h1 {
      font-size: 120px;
      color: #3498db;
      margin: 0;
    }

    h2 {
      font-size: 32px;
      color: #2c3e50;
      margin: 10px 0;
    }

    p {
      color: #7f8c8d;
      margin: 15px 0;
    }

    .btn {
      display: inline-block;
      padding: 12px 30px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }

    .btn:hover {
      background-color: #2980b9;
    }
  `]
})
export class NotFoundComponent { }
```

**Fichier 10 : `src/app/app.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Lazy loading du blog
  {
    path: 'blog',
    loadChildren: () => import('./routes/blog.routes').then(m => m.blogRoutes)
  },

  // Lazy loading de l'admin
  {
    path: 'admin',
    loadChildren: () => import('./routes/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard]
  },

  { path: '**', component: NotFoundComponent }
];
```

**Fichier 11 : `src/app/routes/blog.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { BlogListComponent } from '../pages/blog-list/blog-list.component';
import { BlogDetailComponent } from '../pages/blog-detail/blog-detail.component';

export const blogRoutes: Routes = [
  { path: '', component: BlogListComponent },
  {
    path: ':id',
    component: BlogDetailComponent
  }
];
```

**Fichier 12 : `src/app/routes/admin.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { AdminComponent } from '../pages/admin/admin.component';

export const adminRoutes: Routes = [
  { path: '', component: AdminComponent }
];
```

**Fichier 13 : `src/app/app.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="app-footer">
      <p>&copy; 2024 Blog Angular. Tous droits réservés.</p>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
      background-color: #f5f5f5;
    }

    .app-footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      text-align: center;
      padding: 20px;
      margin-top: 40px;
    }

    .app-footer p {
      margin: 0;
    }
  `]
})
export class AppComponent { }
```

**Tests à effectuer :**
1. ✅ Navigation entre Accueil, Articles, Admin
2. ✅ Cliquer sur un article pour voir le détail
3. ✅ Ajouter un nouvel article depuis Admin
4. ✅ Supprimer un article
5. ✅ Rechercher des articles
6. ✅ Lazy loading fonctionne (vérifier dans DevTools)
7. ✅ Page 404 quand route inexistante

---

### SLIDE 10 : Points Clés du TP1

**EXPLICATIONS DÉTAILLÉES :**

**1. Lazy Loading :**

```typescript
{
  path: 'blog',
  loadChildren: () => import('./routes/blog.routes').then(m => m.blogRoutes)
}
```

Les fichiers blog.routes ne sont chargés que quand on navigue vers `/blog`.

L'ID du paramètre est automatiquement injecté comme `input()` dans le composant.

**2. Signal pour article() :**

```typescript
id = input<string>('');
article = computed(() => {
  const articleId = parseInt(this.id(), 10);
  return this.blogService.getArticleById(articleId);
});
```

Quand l'ID change, le computed recalcule automatiquement.

**4. Navigation programmée :**

```typescript
this.router.navigate(['/blog']);
```

Après une action (suppression), on redirige l'utilisateur.

**5. Hiérarchie des routes :**

Routes imbriquées = hiérarchie logique et layouts spécifiques.

---

## PAUSE DÉJEUNER (12h30-13h30)

---

## PARTIE 2 : REQUÊTES HTTP AVANCÉES (13h30-17h30)

### SLIDE 11 : HttpClient - Requêtes de Base

**Concepts théoriques :**

HttpClient permet de communiquer avec une API REST.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  nom: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com/users';

  // GET - Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET - Récupérer un utilisateur par ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // POST - Créer un utilisateur
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT - Mettre à jour complètement
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // PATCH - Mise à jour partielle
  partialUpdate(id: number, changes: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, changes);
  }

  // DELETE - Supprimer
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**Bootstrap avec HttpClient :**

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
```

**Utilisation dans un composant :**

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    @if (isLoading()) {
      <p>Chargement...</p>
    } @else if (users().length > 0) {
      <ul>
        @for (user of users(); track user.id) {
          <li>{{ user.nom }} - {{ user.email }}</li>
        }
      </ul>
    } @else {
      <p>Aucun utilisateur</p>
    }
  `
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService);
  isLoading = signal(true);
  users = signal<User[]>([]);

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}
```

---

### SLIDE 12 : Gestion d'Erreurs et Retry

**Concepts théoriques :**

Gérer les erreurs HTTP et implémenter une logique de retry.

```typescript
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // Avec retry simple
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      retry(3), // Réessayer 3 fois en cas d'erreur
      catchError(this.handleError)
    );
  }

  // Avec retry avec délai exponentiel
  getUsersWithExponentialBackoff(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          console.log(`Tentative ${retryCount} après ${error.status}`);
          return timer(Math.pow(2, retryCount) * 1000); // 2s, 4s, 8s
        }
      }),
      catchError(this.handleError)
    );
  }

  // Gestion d'erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur serveur
      errorMessage = `Code ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

**Utilisation avec gestion d'erreur :**

```typescript
@Component({...})
export class UsersComponent {
  userService = inject(UserService);
  users = signal<User[]>([]);
  erreur = signal<string>('');

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.erreur.set('');
      },
      error: (err) => {
        this.erreur.set(err.message);
        console.error(err);
      }
    });
  }
}
```

---

### SLIDE 13 : Intercepteurs HTTP

**Concepts théoriques :**

Les intercepteurs modifient les requêtes/réponses HTTP globalement.

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';

// Intercepteur d'authentification
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Ajouter le token à chaque requête
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

// Intercepteur de logging
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  console.log(`Requête [${req.method}] ${req.url}`);

  return next(req).pipe(
    finalize(() => {
      const elapsed = Date.now() - startTime;
      console.log(`Réponse en ${elapsed}ms`);
    })
  );
};

// Intercepteur de gestion d'erreurs
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Non authentifié
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Non autorisé
        alert('Vous n\'avez pas les permissions nécessaires');
      }
      return throwError(() => error);
    })
  );
};
```

**Enregistrer les intercepteurs :**

```typescript
// main.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loggingInterceptor,
        errorInterceptor
      ])
    )
  ]
});
```

---

### SLIDE 14 : Authentification JWT Complète

**Concepts théoriques :**

Implémenter un système d'authentification avec JWT.

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface LoginResponse {
  token: string;
  utilisateur: {
    id: number;
    nom: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://api.example.com/auth';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private utilisateur = signal<any>(null);

  isAuthenticated = computed(() => !!this.tokenSignal());

  constructor() {
    // Charger le token au démarrage
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.tokenSignal.set(token);
    }
  }

  // Connexion
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.tokenSignal.set(response.token);
        this.utilisateur.set(response.utilisateur);
        localStorage.setItem('auth_token', response.token);
      }),
      catchError(error => {
        console.error('Erreur de connexion', error);
        return throwError(() => new Error('Identifiants invalides'));
      })
    );
  }

  // Déconnexion
  logout(): void {
    this.tokenSignal.set(null);
    this.utilisateur.set(null);
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  // Getter du token
  getToken(): string | null {
    return this.tokenSignal();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Récupérer le profil
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
}

// Guard pour protéger les routes
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

---

### SLIDE 15 : Nouvelle API Resource (Angular 19+)

**Concepts théoriques :**

Angular 19+ introduit l'API Resource pour simplifier les requêtes HTTP.

**Approche 1 : Resource simple (chargement automatique)**

```typescript
import { resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  // Resource simple - chargement automatique au démarrage
  products = resource({
    loader: () => this.http.get<Product[]>('/api/products')
  });
}

// Utilisation dans un composant
@Component({
  selector: 'app-products',
  standalone: true,
  template: `
    @if (productService.products.isLoading()) {
      <p>Chargement...</p>
    } @else if (productService.products.error()) {
      <p>Erreur: {{ productService.products.error()?.message }}</p>
    } @else {
      <ul>
        @for (product of productService.products.value(); track product.id) {
          <li>{{ product.name }} - {{ product.price }}€</li>
        }
      </ul>
    }
  `
})
export class ProductsComponent {
  productService = inject(ProductService);
}
```

**Approche 2 : Resource avec paramètre réactif**

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  // Signal pour le terme de recherche
  searchTerm = signal('');

  // Resource réactive - recharge automatiquement quand searchTerm change
  searchResults = resource({
    request: () => ({ term: this.searchTerm() }),
    loader: ({ request }) =>
      this.http.get<Product[]>(`/api/products/search?q=${request.term}`)
  });
}

// Utilisation
@Component({
  selector: 'app-search',
  template: `
    <input 
      [ngModel]="productService.searchTerm()" 
      (ngModelChange)="productService.searchTerm.set($event)"
    />
    
    @if (productService.searchResults.isLoading()) {
      <p>Recherche...</p>
    } @else {
      @for (product of productService.searchResults.value(); track product.id) {
        <li>{{ product.name }}</li>
      }
    }
  `
})
export class SearchComponent {
  productService = inject(ProductService);
}
// Quand searchTerm() change → rechargement automatique !
```

**Approche 3 : Resource avec chargement manuel**

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  // Resource avec chargement manuel
  // Ne charge PAS automatiquement au démarrage
  productDetail = resource({
    request: () => null, // Pas de requête initiale
    loader: ({ request }) => {
      if (!request) return of(null); // Retourne null si pas de requête
      return this.http.get<Product>(`/api/products/${request}`);
    }
  });

  // Méthode pour déclencher le chargement manuellement
  loadProduct(id: number) {
    this.productDetail.reload(id);
  }
}

// Utilisation
@Component({
  selector: 'app-product-detail',
  template: `
    <button (click)="charger(5)">Charger produit 5</button>
    
    @if (productService.productDetail.isLoading()) {
      <p>Chargement...</p>
    } @else if (productService.productDetail.value()) {
      <div>
        <h2>{{ productService.productDetail.value()?.name }}</h2>
        <p>{{ productService.productDetail.value()?.price }}€</p>
      </div>
    }
  `
})
export class ProductDetailComponent {
  productService = inject(ProductService);

  charger(id: number) {
    this.productService.loadProduct(id);
  }
}
```

**Résumé des 3 approches :**

| Approche | Quand charger | Cas d'usage |
|----------|---------------|-------------|
| **Simple** | Automatiquement au démarrage | Liste de données fixes |
| **Réactive** | Automatiquement quand signal change | Recherche, filtres |
| **Manuelle** | Sur appel explicite `.reload()` | Détails à la demande |

**Avantages de Resource :**
- API déclarative
- Gestion automatique du loading/error
- Réactivité intégrée
- Moins de code à écrire

---

### SLIDE 16 : SSR et Hydration Progressive - Guide Complet

**QU'EST-CE QUE L'HYDRATION ?**

L'hydration est le processus par lequel Angular "réveille" le HTML statique généré côté serveur (SSR) pour le rendre interactif côté client.

**Problème sans hydration progressive :**
```
Serveur → HTML statique envoyé au navigateur
         ↓
Client   → Angular recharge TOUT en une fois
         → UI bloquée pendant l'hydration
         → Mauvaise expérience utilisateur (500ms-2s de freeze)
```

**Solution avec hydration progressive :**
```
Serveur → HTML statique envoyé au navigateur
         ↓
Client   → Hydration par priorité:
         1. Éléments visibles/critiques d'abord
         2. Éléments hors-viewport plus tard
         3. Composants complexes à la demande
         → UI fluide, pas de blocage
```

---

### INSTALLATION ET CONFIGURATION SSR

**Étape 1 : Ajouter SSR au projet**

```bash
# Ajouter SSR à votre projet existant
ng add @angular/ssr

# Cette commande génère automatiquement:
# - src/main.server.ts
# - src/app/app.config.server.ts
# - server.ts
# - tsconfig.server.json
```

**Étape 2 : Configuration automatique**

```typescript
// angular.json - Configuration SSR générée automatiquement
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "outputHashing": "all",
              "optimization": true,
              "sourceMap": false,
              "ssr": true // ✅ SSR activé
            }
          }
        },
        "server": {
          "builder": "@angular/platform-server:build"
        }
      }
    }
  }
}

// src/main.server.ts - Point d'entrée serveur
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export default bootstrapApplication(AppComponent, config);

// src/app/app.config.server.ts - Configuration serveur
import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ...appConfig.providers
  ]
};
```

---

### CONFIGURATION DE L'HYDRATION PROGRESSIVE

**Configuration complète dans main.ts :**

```typescript
// src/main.ts - Configuration client
import { bootstrapApplication } from '@angular/platform-browser';
import { 
  provideClientHydration, 
  withIncrementalHydration,
  withEventReplay,
  withI18nSupport
} from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    // Active l'hydration progressive
    provideClientHydration(
      withIncrementalHydration(), // Hydratation différée
      withEventReplay(),          // Rejoue les événements utilisateur
      withI18nSupport()           // Support i18n (optionnel)
    )
  ]
});
```

**Explications des options :**

- `withIncrementalHydration()` : Active l'hydration progressive (charge les composants par priorité)
- `withEventReplay()` : Capture et rejoue les clics/événements effectués avant l'hydration complète
- `withI18nSupport()` : Active le support de l'internationalisation (optionnel)

---

### LES 4 STRATÉGIES D'HYDRATION

**Stratégie 1 : Hydration IMMÉDIATE (par défaut)**

Pour les composants critiques qui doivent être interactifs immédiatement.

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <nav>
      <button (click)="toggleMenu()">Menu</button>
      <input [(ngModel)]="search" placeholder="Rechercher...">
    </nav>
  `
})
export class HeaderComponent {
  // Composant hydraté IMMÉDIATEMENT au chargement
  // Utilisé pour: navigation, header, éléments interactifs critiques
  search = '';
  
  toggleMenu() {
    console.log('Menu toggled');
  }
}
```

**Quand utiliser :** 
- Navigation principale
- Boutons critiques
- Formulaires de recherche
- Tout élément visible et interactif au-dessus de la ligne de flottaison

---

**Stratégie 2 : Hydration ON IDLE (au repos)**

Hydrate le composant quand le navigateur est inactif.

```typescript
@Component({
  selector: 'app-recommendations',
  standalone: true,
  template: `
    @defer (on idle) {
      <div class="recommendations">
        <h3>Recommandations pour vous</h3>
        @for (item of recommendations; track item.id) {
          <app-product-card [product]="item" />
        }
      </div>
    } @placeholder {
      <div class="skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    } @loading (minimum 200ms) {
      <div class="spinner">Chargement...</div>
    }
  `
})
export class RecommendationsComponent {
  // Hydraté quand le CPU est disponible
  recommendations = signal<Product[]>([]);
}
```

**Fonctionnement :**
```
1. Page charge → Contenu principal hydraté
2. Navigateur idle (rien à faire) → Angular hydrate ce composant
3. Délai: généralement 50-200ms après le chargement initial
```

**Quand utiliser :**
- Contenu secondaire visible
- Widgets de recommandation
- Modules non-critiques mais visibles
- Composants lourds en bas de page

---

**Stratégie 3 : Hydration ON VIEWPORT (au scroll)**

Hydrate uniquement quand l'utilisateur scrolle jusqu'au composant.

```typescript
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    @defer (on viewport) {
      <footer class="footer">
        <div class="footer-links">
          @for (link of footerLinks; track link.id) {
            <a [href]="link.url">{{ link.label }}</a>
          }
        </div>
        <app-newsletter-signup />
        <app-social-links />
      </footer>
    } @placeholder {
      <!-- Réserver l'espace pour éviter le layout shift -->
      <div style="height: 200px;"></div>
    }
  `
})
export class FooterComponent {
  // Hydraté SEULEMENT quand visible dans le viewport
  footerLinks = signal<Link[]>([]);
}
```

**Exemple avancé avec seuil personnalisé :**

```typescript
@Component({
  selector: 'app-article-comments',
  template: `
    <!-- Commence à charger 200px AVANT d'être visible -->
    @defer (on viewport(200px)) {
      <section class="comments">
        <h3>Commentaires ({{ comments().length }})</h3>
        @for (comment of comments(); track comment.id) {
          <app-comment [comment]="comment" />
        }
      </section>
    } @placeholder {
      <div class="comments-placeholder">
        <p>Les commentaires se chargeront en scrollant</p>
      </div>
    }
  `
})
export class ArticleCommentsComponent {
  private commentService = inject(CommentService);
  comments = signal<Comment[]>([]);
  
  constructor() {
    // Les données se chargent aussi à la demande
    effect(() => {
      this.commentService.getComments()
        .subscribe(c => this.comments.set(c));
    });
  }
}
```

**Quand utiliser :**
- Footer
- Sections de commentaires
- Contenu sous la ligne de flottaison
- Galeries d'images
- Tout contenu hors écran au chargement initial

---

**Stratégie 4 : Hydration ON INTERACTION (au clic/hover)**

Hydrate uniquement quand l'utilisateur interagit avec la zone.

```typescript
@Component({
  selector: 'app-complex-form',
  standalone: true,
  template: `
    @defer (on interaction) {
      <div class="form-container">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <input formControlName="name" placeholder="Nom">
          <input formControlName="email" placeholder="Email">
          <textarea formControlName="message" rows="5"></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </div>
    } @placeholder {
      <div class="form-placeholder" style="min-height: 300px;">
        <p>📝 Cliquez ici pour charger le formulaire</p>
      </div>
    } @loading {
      <div class="loading">Chargement du formulaire...</div>
    }
  `
})
export class ComplexFormComponent {
  // Hydraté uniquement au premier clic dans la zone
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl('')
  });
  
  onSubmit() {
    console.log(this.form.value);
  }
}
```

**Cas d'usage avancé : Modal/Dialog**

```typescript
@Component({
  selector: 'app-product-details',
  template: `
    <div class="product-card">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }} €</p>
      
      <button (click)="showDetails = true">
        Voir détails complets
      </button>
      
      @if (showDetails) {
        @defer (on interaction) {
          <app-product-modal 
            [product]="product"
            (close)="showDetails = false"
          />
        } @loading (minimum 100ms) {
          <div class="modal-loading">Chargement...</div>
        }
      }
    </div>
  `
})
export class ProductDetailsComponent {
  showDetails = false;
  @Input() product!: Product;
}
```

**Quand utiliser :**
- Formulaires complexes
- Modals/Dialogs
- Composants lourds rarement utilisés
- Éditeurs de texte riches
- Tableaux de données complexes

---

### DÉTECTER L'ENVIRONNEMENT (Browser vs Server)

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  template: `
    @if (isBrowser()) {
      <!-- Code spécifique au navigateur -->
      <div (click)="onClick()">Interactif</div>
      <canvas #myCanvas></canvas>
    } @else {
      <!-- Code spécifique au serveur -->
      <div>Contenu statique pour SEO</div>
    }
  `
})
export class ContentComponent {
  platformId = inject(PLATFORM_ID);

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  isServer() {
    return isPlatformServer(this.platformId);
  }

  onClick() {
    // Uniquement côté client
    console.log('Clic côté client uniquement');
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      // Utiliser des APIs navigateur (localStorage, window, etc.)
      const data = localStorage.getItem('key');
      console.log('Window width:', window.innerWidth);
    }
  }
}
```

---

### MARQUEURS D'HYDRATION DANS LE HTML

Angular insère automatiquement des marqueurs spéciaux dans le HTML pour reconnaître et hydrater les composants.

**HTML généré par le serveur (SSR) :**

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Début marqueur de l'app -->
  <!--ngh: 0-->
  <app-root _nghost-ng-c123="">
    
    <!-- Composant header - hydraté immédiatement -->
    <!--ngh: 1-->
    <app-header _ngcontent-ng-c123="">
      <nav>
        <button>Menu</button>
      </nav>
    </app-header>
    <!--/ngh: 1-->
    
    <!-- Composant produits - différé -->
    <!--ngh: 2 (deferred)-->
    <app-products _ngcontent-ng-c123="">
      <div>Liste de produits...</div>
    </app-products>
    <!--/ngh: 2-->
    
    <!-- Footer - viewport -->
    <!--ngh: 3 (viewport)-->
    <app-footer _ngcontent-ng-c123="">
      <footer>Footer content</footer>
    </app-footer>
    <!--/ngh: 3-->
    
  </app-root>
  <!--/ngh: 0-->
  
  <!-- Scripts Angular -->
  <script src="main.js" defer></script>
</body>
</html>
```

**Signification des marqueurs :**
- `<!--ngh: X-->` : Début d'un composant hydratatable (numéro X)
- `<!--/ngh: X-->` : Fin du composant
- `(deferred)` : Marqueur indiquant une hydration différée
- `(viewport)` : Marqueur pour hydration au scroll
- `_nghost-ng-cXXX` : Identifiant de composant Angular

**Ce qui se passe côté client :**

```
Processus d'hydration (simplifié):
1. Angular charge et parse le DOM
2. Lit les marqueurs <!--ngh: X-->
3. Associe chaque marqueur à son composant TypeScript
4. Attache les event listeners selon la stratégie:
   - Immédiat: tout de suite
   - Idle: quand CPU libre
   - Viewport: avec IntersectionObserver
   - Interaction: au premier événement
5. Réutilise le DOM existant (pas de re-render)
```

---

### EXEMPLE COMPLET : PAGE BLOG OPTIMISÉE

```typescript
@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    HeaderComponent,
    BreadcrumbComponent,
    ArticleContentComponent,
    RecommendationsComponent,
    CommentsComponent,
    NewsletterComponent,
    FooterComponent
  ],
  template: `
    <!-- 1. IMMÉDIAT - Navigation critique -->
    <app-header />
    
    <!-- 2. IMMÉDIAT - Contenu principal -->
    <main>
      <app-breadcrumb [path]="breadcrumbPath" />
      
      <article>
        <h1>{{ article.title }}</h1>
        <div [innerHTML]="article.content"></div>
      </article>
      
      <!-- 3. ON IDLE - Recommandations -->
      @defer (on idle) {
        <app-recommendations [category]="article.category" />
      } @placeholder {
        <div class="recommendations-skeleton"></div>
      }
      
      <!-- 4. ON VIEWPORT - Commentaires -->
      @defer (on viewport(300px)) {
        <app-comments [articleId]="article.id" />
      } @placeholder {
        <div style="height: 400px;">
          <p>Les commentaires se chargeront en scrollant...</p>
        </div>
      }
      
      <!-- 5. ON INTERACTION - Newsletter popup -->
      @defer (on interaction) {
        <app-newsletter-popup />
      }
      
      <!-- 6. ON VIEWPORT - Footer -->
      @defer (on viewport) {
        <app-footer />
      } @placeholder {
        <div style="height: 200px;"></div>
      }
    </main>
  `
})
export class BlogPostComponent {
  article = input.required<Article>();
  breadcrumbPath = computed(() => [
    { label: 'Accueil', url: '/' },
    { label: 'Blog', url: '/blog' },
    { label: this.article().title, url: '' }
  ]);
}
```

---

### MÉTRIQUES ET BÉNÉFICES

**Avant hydration progressive :**
```
📊 Métriques typiques :
- First Contentful Paint (FCP): 1.2s
- Time to Interactive (TTI): 3.5s ❌ (tout hydraté d'un coup)
- Total Blocking Time (TBT): 800ms ❌
- JavaScript exécuté au démarrage: 250kb
```

**Après hydration progressive :**
```
📊 Métriques améliorées :
- First Contentful Paint (FCP): 1.2s (identique)
- Time to Interactive (TTI): 1.8s ✅ (50% plus rapide)
- Total Blocking Time (TBT): 200ms ✅ (75% réduit)
- JavaScript exécuté au démarrage: 80kb ✅ (68% réduit)
- JavaScript différé: 170kb (chargé progressivement)
```

**Gains concrets :**
- ✅ **Réduction de 50% du Time to Interactive**
- ✅ **Réduction de 75% du blocage UI**
- ✅ **Meilleur score Lighthouse** (90+ vs 70)
- ✅ **Économie de bande passante mobile**
- ✅ **Meilleure expérience utilisateur perçue**

---

### BONNES PRATIQUES

**✅ À FAIRE :**

1. **Prioriser le contenu visible**
```typescript
<app-hero-section />        // Immédiat
<app-main-content />        // Immédiat
<app-sidebar />             // On idle
<app-footer />              // On viewport
```

2. **Utiliser des placeholders visuels**
```typescript
@defer (on viewport) {
  <app-comments />
} @placeholder {
  <div class="comments-skeleton">
    <div class="skeleton-avatar"></div>
    <div class="skeleton-text"></div>
  </div>
}
```

3. **Prévoir le minimum time**
```typescript
@defer (on idle) {
  <app-widget />
} @loading (minimum 100ms) {
  <div class="spinner"></div>
}
```

**❌ À ÉVITER :**

1. **Tout mettre en defer sans réflexion**
```typescript
// ❌ Mauvais : Navigation non-interactive
@defer (on interaction) {
  <app-header />
}
```

2. **Oublier les placeholders**
```typescript
// ❌ Mauvais : Layout shift
@defer (on viewport) {
  <app-footer />
}

// ✅ Bon : Réserver l'espace
@defer (on viewport) {
  <app-footer />
} @placeholder {
  <div style="height: 200px;"></div>
}
```

---

### CHECKLIST D'IMPLÉMENTATION

**Configuration initiale :**
- [ ] Installer Angular 19+
- [ ] Activer SSR (`ng add @angular/ssr`)
- [ ] Configurer `provideClientHydration()` dans `main.ts`
- [ ] Ajouter `withIncrementalHydration()`
- [ ] Ajouter `withEventReplay()`

**Optimisation des composants :**
- [ ] Identifier les composants critiques → laisser en immédiat
- [ ] Identifier le contenu visible secondaire → `@defer (on idle)`
- [ ] Identifier le contenu hors-viewport → `@defer (on viewport)`
- [ ] Identifier les composants rares/lourds → `@defer (on interaction)`

**Tests :**
- [ ] Tester dans Chrome DevTools (Network throttling)
- [ ] Mesurer les Core Web Vitals (Lighthouse)
- [ ] Tester sur mobile réel
- [ ] Vérifier les placeholders
- [ ] Vérifier que `withEventReplay()` fonctionne

**Avantages SSR + Hydration Progressive :**
- ✅ SEO optimal
- ✅ Temps de premier affichage < 500ms
- ✅ Pas de flash de contenu
- ✅ Meilleure performance sur mobile
- ✅ Réduction du Time to Interactive de 50%
- ✅ Meilleur score Lighthouse

---

### SLIDE 17 : TP2 - Todo App avec API Backend

**ÉNONCÉ DU TP :**

**Durée : 1h30**

**Objectif :** Intégrer une API REST pour persister les todos.

**API à utiliser : JSONPlaceholder**
```
Base URL: https://jsonplaceholder.typicode.com
GET    /todos      - Lister tous les todos
GET    /todos/1    - Récupérer un todo
POST   /todos      - Créer un todo
PUT    /todos/1    - Mettre à jour
DELETE /todos/1    - Supprimer
```

**Fonctionnalités attendues :**

1. **Chargement initial**
   - Afficher un loader
   - Charger les 10 premiers todos de l'API
   - Gérer les erreurs

2. **Ajout de todo**
   - Formulaire réactif
   - POST vers l'API
   - Mise à jour de la liste locale

3. **Modification de todo**
   - Cocher/décocher un todo
   - PUT vers l'API
   - État loading pendant la requête

4. **Suppression de todo**
   - DELETE vers l'API
   - Mise à jour de la liste

5. **Gestion d'erreurs**
   - Affichage des erreurs
   - Bouton "Réessayer"

**Structure technique attendue :**

```typescript
// Interface Todo
interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// Service TodoService
// - Méthodes CRUD complètes
// - Gestion d'erreurs
// - BehaviorSubject pour l'état

// Composant TodoListComponent
// - Affichage avec @if/@for
// - FormControl pour ajout
// - Signals pour loading/error
```

**Tests attendus :**
- Chargement initial des todos
- Ajout d'un nouveau todo
- Cocher/décocher un todo
- Supprimer un todo
- Affichage des erreurs
- Bouton réessayer fonctionne

---

### SLIDE 17 (suite) : TP2 - Correction Complète

**CORRECTION COMPLÈTE :**

**Fichier 1 : `src/app/models/todo.ts`**

```typescript
export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
```

**Fichier 2 : `src/app/services/todo.service.ts`**

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, throwError } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  // Charger tous les todos
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap(todos => {
        this.todosSubject.next(todos.slice(0, 10)); // Limiter à 10
      }),
      catchError(this.handleError)
    );
  }

  // Récupérer un todo
  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un todo
  createTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(newTodo => {
        const current = this.todosSubject.value;
        this.todosSubject.next([...current, newTodo]);
      }),
      catchError(this.handleError)
    );
  }

  // Mettre à jour un todo
  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      tap(updated => {
        const current = this.todosSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          current[index] = updated;
          this.todosSubject.next([...current]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Supprimer un todo
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.todosSubject.value;
        this.todosSubject.next(current.filter(t => t.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erreur API:', error);
    return throwError(() => new Error('Erreur lors de la requête API'));
  }
}
```

**Fichier 3 : `src/app/components/todo-list/todo-list.component.ts`**

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo';
import { signal } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Ma Todo List API</h1>

      <!-- État du chargement -->
      @if (isLoading()) {
        <div class="loading">
          <p>Chargement des tâches...</p>
        </div>
      }

      @if (erreur()) {
        <div class="error">
          <p>❌ {{ erreur() }}</p>
          <button (click)="recharger()">Réessayer</button>
        </div>
      }

      <!-- Formulaire d'ajout -->
      <div class="add-form">
        <input
          type="text"
          [formControl]="nouvelleTache"
          placeholder="Nouvelle tâche..."
          (keyup.enter)="ajouterTache()"
        >
        <button (click)="ajouterTache()" [disabled]="!nouvelleTache.value">
          Ajouter
        </button>
      </div>

      <!-- Statistiques -->
      @if (todos().length > 0) {
        <div class="stats">
          <p>Total: {{ todos().length }}</p>
          <p>Complétées: {{ todos().filter(t => t.completed).length }}</p>
        </div>
      }

      <!-- Liste des todos -->
      @if (todos().length > 0) {
        <ul class="todo-list">
          @for (todo of todos(); track todo.id) {
            <li [class.completed]="todo.completed">
              <input
                type="checkbox"
                [checked]="todo.completed"
                (change)="basculerTodo(todo)"
                [disabled]="isUpdating(todo.id)"
              >
              <span>{{ todo.title }}</span>
              <button
                (click)="supprimerTodo(todo.id)"
                [disabled]="isUpdating(todo.id)"
                class="btn-delete"
              >
                ×
              </button>
            </li>
          }
        </ul>
      } @else if (!isLoading()) {
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
      font-family: Arial, sans-serif;
    }

    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 20px;
    }

    .loading, .error {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .loading {
      background-color: #e3f2fd;
      color: #1976d2;
      text-align: center;
    }

    .error {
      background-color: #ffebee;
      color: #c62828;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .error button {
      padding: 5px 10px;
      background-color: #c62828;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .add-form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
    }

    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .stats {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .stats p {
      margin: 5px 0;
      font-size: 14px;
    }

    .todo-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #eee;
      gap: 10px;
    }

    li.completed {
      opacity: 0.6;
    }

    li.completed span {
      text-decoration: line-through;
    }

    input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    span {
      flex: 1;
    }

    .btn-delete {
      padding: 5px 10px;
      background-color: #dc3545;
      font-size: 18px;
      line-height: 1;
    }

    .btn-delete:hover:not(:disabled) {
      background-color: #c82333;
    }

    .empty {
      text-align: center;
      color: #999;
      padding: 30px;
    }
  `]
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);

  isLoading = signal(true);
  erreur = signal('');
  todos = signal<Todo[]>([]);
  updatingTodos = signal<Set<number>>(new Set());

  nouvelleTache = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.chargerTodos();
  }

  chargerTodos() {
    this.isLoading.set(true);
    this.erreur.set('');

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.erreur.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  ajouterTache() {
    if (this.nouvelleTache.valid && this.nouvelleTache.value) {
      const nouveauTodo = {
        userId: 1,
        title: this.nouvelleTache.value,
        completed: false
      };

      this.todoService.createTodo(nouveauTodo).subscribe({
        next: (todo) => {
          this.todos.update(todos => [...todos, todo]);
          this.nouvelleTache.reset();
        },
        error: (err) => {
          alert('Erreur lors de l\'ajout: ' + err.message);
        }
      });
    }
  }

  basculerTodo(todo: Todo) {
    this.addUpdating(todo.id);

    this.todoService.updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed
    }).subscribe({
      next: (updated) => {
        this.todos.update(todos =>
          todos.map(t => t.id === updated.id ? updated : t)
        );
        this.removeUpdating(todo.id);
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour: ' + err.message);
        this.removeUpdating(todo.id);
      }
    });
  }

  supprimerTodo(id: number) {
    if (confirm('Supprimer cette tâche ?')) {
      this.addUpdating(id);

      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.todos.update(todos => todos.filter(t => t.id !== id));
          this.removeUpdating(id);
        },
        error: (err) => {
          alert('Erreur lors de la suppression: ' + err.message);
          this.removeUpdating(id);
        }
      });
    }
  }

  recharger() {
    this.chargerTodos();
  }

  isUpdating(id: number): boolean {
    return this.updatingTodos().has(id);
  }

  private addUpdating(id: number) {
    this.updatingTodos.update(set => {
      const newSet = new Set(set);
      newSet.add(id);
      return newSet;
    });
  }

  private removeUpdating(id: number) {
    this.updatingTodos.update(set => {
      const newSet = new Set(set);
      newSet.delete(id);
      return newSet;
    });
  }
}
```

**Tests à effectuer :**
1. ✅ Chargement initial des 10 premiers todos
2. ✅ Ajout d'un nouveau todo
3. ✅ Cocher/décocher un todo (état loading)
4. ✅ Supprimer un todo
5. ✅ Affichage du loader pendant les requêtes
6. ✅ Gestion des erreurs avec bouton réessayer
7. ✅ Compteur de todos complétés

---

### SLIDE 18 : Points Clés du TP2

**EXPLICATIONS DÉTAILLÉES :**

**1. BehaviorSubject pour l'état :**

```typescript
private todosSubject = new BehaviorSubject<Todo[]>([]);
todos$ = this.todosSubject.asObservable();
```

Permet de partager l'état entre service et composants.

**2. Tap pour mise à jour :**

```typescript
tap(newTodo => {
  const current = this.todosSubject.value;
  this.todosSubject.next([...current, newTodo]);
})
```

Met à jour l'état local après le succès de l'API.

**3. État de loading par todo :**

```typescript
updatingTodos = signal<Set<number>>(new Set());

isUpdating(id: number): boolean {
  return this.updatingTodos().has(id);
}
```

Permet de désactiver uniquement le todo en cours de modification.

**4. Gestion d'erreurs :**

```typescript
private handleError(error: any) {
  console.error('Erreur API:', error);
  return throwError(() => new Error('Erreur lors de la requête API'));
}
```

Centralise la gestion d'erreurs.

---

### SLIDE 19 : Résumé du Jour 3

**Ce que vous avez appris :**

✅ **Routing et Navigation :**
- Configuration des routes
- Navigation avec RouterLink et Router
- Lazy loading de modules
- Guards pour protection
- Route Inputs
- Routes imbriquées

✅ **Requêtes HTTP :**
- HttpClient (GET, POST, PUT, DELETE)
- Gestion d'erreurs et retry
- Intercepteurs globaux
- Authentification JWT

✅ **API Resource (Angular 19+) :**
- Resource simple (auto)
- Resource réactive (signal)
- Resource manuelle

✅ **SSR et Performance :**
- Server-Side Rendering
- Hydration progressive
- Communication API-Frontend
- Gestion d'erreurs robuste

✅ **Pratique :**
- Application Blog complète avec routing
- Todo List avec API REST
- Gestion du loading et erreurs
- UX responsive

---

### SLIDE 20 : Préparation Formation Complète

**Vous avez maîtrisé :**
- ✅ TypeScript et Décorateurs
- ✅ Composants et Data Binding
- ✅ Réactivité et Signals
- ✅ Services et Injection
- ✅ Formulaires Réactifs
- ✅ Routing et Navigation
- ✅ Requêtes HTTP
- ✅ Architectures scalables

**Prochaines étapes recommandées :**

1. **State Management**
   - NgRx (redux pattern)
   - Signaux globaux

2. **Testing**
   - Jasmine et Vitest
   - Tests unitaires
   - Tests d'intégration
   - Tests E2E (Cypress, Playwright)

3. **Performance**
   - Change Detection Strategy
   - OnPush et Signals
   - Lazy Loading
   - Code Splitting

4. **Production**
   - Build optimization
   - Minification
   - Tree-shaking
   - SSR deployment

5. **DevOps**
   - CI/CD (GitHub Actions, GitLab CI)
   - Docker
   - Cloud deployment

---

## ANNEXE : CHEAT SHEET JOUR 3

### Routes Configuration

```typescript
// Routes basiques
{ path: '', redirectTo: 'home', pathMatch: 'full' }
{ path: 'home', component: HomeComponent }
{ path: 'detail/:id', component: DetailComponent }

// Routes imbriquées
{ 
  path: 'admin',
  component: AdminLayout,
  children: [
    { path: 'users', component: UsersComponent }
  ]
}

// Lazy loading
{ 
  path: 'shop',
  loadChildren: () => import('./shop.routes').then(m => m.shopRoutes)
}

// Wildcard
{ path: '**', component: NotFoundComponent }
```

### Navigation

```typescript
// Template
<a routerLink="/home">Home</a>
<a [routerLink]="['/detail', id]">Detail</a>
<a routerLink="/home" routerLinkActive="active">Home</a>

// Programmatique
router.navigate(['/home']);
router.navigate(['/detail', id], { queryParams: { sort: 'name' } });
```

### HttpClient

```typescript
// GET
http.get<Type>('/api/data')

// POST
http.post<Type>('/api/data', body)

// PUT
http.put<Type>('/api/data/1', updates)

// PATCH
http.patch<Type>('/api/data/1', changes)

// DELETE
http.delete('/api/data/1')

// Avec options
http.get<Type>('/api/data', {
  params: { skip: 10, limit: 20 },
  headers: { 'Authorization': 'Bearer token' }
})
```

### Guards et Resolvers

```typescript
// CanActivate Guard
export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isAuthenticated();
};

// CanDeactivate Guard
export const unsavedGuard: CanDeactivateFn<any> = (component) => {
  return !component.hasUnsavedChanges();
};

// Resolver
export const dataResolver: ResolveFn<Data> = (route) => {
  return inject(DataService).getData(route.paramMap.get('id'));
};

// Utilisation
{ 
  path: 'admin', 
  component: AdminComponent,
  canActivate: [authGuard],
  canDeactivate: [unsavedGuard],
  resolve: { data: dataResolver }
}
```

### Intercepteurs

```typescript
// Intercepteur moderne (fonction)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });
  }
  
  return next(req);
};

// Enregistrer
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

### Resource API

```typescript
// Simple
products = resource({
  loader: () => http.get<Product[]>('/api/products')
});

// Réactive
searchResults = resource({
  request: () => ({ term: searchTerm() }),
  loader: ({ request }) => http.get(`/api/search?q=${request.term}`)
});

// Utilisation
@if (products.isLoading()) { ... }
@if (products.error()) { ... }
@for (item of products.value(); track item.id) { ... }
```

---

**FIN DU JOUR 3**

*Total estimé : 8 heures (théorie + pratique)*
*Pause déjeuner : 1 heure*
*Temps de pratique : 3h00*
*Vous maîtrisez maintenant le routing et les requêtes HTTP ! 🚀*
