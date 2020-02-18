import { Pipe, PipeTransform } from '@angular/core';
import { Filters } from './types/Filter';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return Filters[value];
  }

}
