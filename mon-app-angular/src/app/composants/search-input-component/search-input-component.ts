import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatFormField, MatLabel } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input-component',
  imports: [ReactiveFormsModule, MatInput, MatFormField, MatLabel],
  templateUrl: './search-input-component.html',
  styleUrl: './search-input-component.css',
})
export class SearchInputComponent {
  searchControl = new FormControl<string>('');

  searchLabel = input<string>();
  search = output<string>();

  constructor() {
    this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search.emit(value ?? '');
    })
  }
}
