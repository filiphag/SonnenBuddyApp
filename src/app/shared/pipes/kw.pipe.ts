import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kw',
})
export class KwPipe implements PipeTransform {
  transform(value: number, precision = 1): string {
    value = Math.abs(value);
    if (value > 1000) 
    {
      const kw = value > 0 ? this.round(value / 1000, precision) : 0;
      return `${kw.toFixed(precision)} kW`;
    }
    else {
      const w = value > 0 ? this.round(value, precision) : 0;
      return `${w.toFixed(0)} W`;
    }
  }

  private round(value: number, precision: number) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
