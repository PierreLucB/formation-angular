import { Component, contentChild, ElementRef } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-card-component',
  imports: [MatCard],
  templateUrl: './card-component.html',
  styleUrl: './card-component.css',
})
export class CardComponent {
  projection = contentChild<ElementRef>('projection');
}
