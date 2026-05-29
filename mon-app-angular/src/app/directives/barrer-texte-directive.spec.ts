import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { BarrerTexteDirective } from './barrer-texte-directive';

@Component({
  template: `<p barrerTexte [condition]="condition()">Texte test</p>`,
  imports: [BarrerTexteDirective],
})
class TestHostComponent {
  condition = signal(false);
}

describe('BarrerTexteDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ne barre pas le texte quand condition est false', () => {
    const p = fixture.nativeElement.querySelector('p') as HTMLElement;
    expect(p.style.textDecorationLine).toBe('none');
  });

  it('barre le texte quand condition est true', () => {
    host.condition.set(true);
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p') as HTMLElement;
    expect(p.style.textDecorationLine).toBe('line-through');
  });
});