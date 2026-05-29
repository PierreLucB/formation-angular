import { TestBed } from '@angular/core/testing';
import { BarrerTexteDirective } from './barrer-texte-directive';

describe('BarrerTexteDirective', () => {

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [BarrerTexteDirective]
    }).compileComponents()
  })

  it('should create an instance', () => {
    const directive = TestBed.inject(BarrerTexteDirective);
    expect(directive).toBeTruthy();
  });
});
