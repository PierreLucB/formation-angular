import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLengthPipe',
})
export class MaxLengthPipePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
