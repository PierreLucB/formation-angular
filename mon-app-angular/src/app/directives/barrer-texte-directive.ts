import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[barrerTexte]',
})
export class BarrerTexteDirective {

  condition = input.required<boolean>();

  // Injection de l'élément surlequel la directive est portée
  elementEnCours: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  constructor() {

    effect(() => {
      const barrer: boolean = this.condition();

      this.elementEnCours.nativeElement.style.textDecorationLine = barrer ? 'line-through' : 'none';
    })
  }
}
