import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength',
})
export class MaxLengthPipe implements PipeTransform {
  transform(value: string | null, maxLength: number = 20): unknown {

    const suffix = (value ?? '').length > maxLength ? '...' : ''
    return (value ?? '').substring(0, maxLength) + suffix;
  }
}
