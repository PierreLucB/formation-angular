import { Component, signal } from '@angular/core';
import { SearchInputComponent } from '../search-input-component/search-input-component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-component',
  imports: [SearchInputComponent, MatProgressSpinner],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css',
})
export class SearchComponent {

  produits: Produit[] = [
    { id: 1, nom: 'Ordinateur portable', categorie: 'Électronique' },
    { id: 2, nom: 'Souris sans fil', categorie: 'Électronique' },
    { id: 3, nom: 'Clavier mécanique', categorie: 'Électronique' },
    { id: 4, nom: 'Chaise de bureau', categorie: 'Mobilier' },
    { id: 5, nom: 'Bureau ajustable', categorie: 'Mobilier' },
    { id: 6, nom: 'Lampe LED', categorie: 'Éclairage' }
  ];

  loading = signal(false);

  produitsAffiches = signal(this.produits);

  applyFilter(filter: string): void {
    this.loading.set(true);

    setTimeout(() => {
      this.produitsAffiches.set(
        this.produits.filter(p => p.nom.toLowerCase().includes(filter.toLowerCase()))
      );

      this.loading.set(false);
    }, 2000);

  }

}
