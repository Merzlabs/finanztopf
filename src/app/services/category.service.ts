import { Injectable } from '@angular/core';
import { PecuniatorEntry } from '@merzlabs/pecuniator-api';
import { Category } from '../types/Category';

/**
 * Just for categorizing one field added
 */
export interface CheckEntry extends PecuniatorEntry {
  found?: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  checkCategories(entry: CheckEntry, categories: Category[]) {
    for (const cat of categories) {
      if (!cat.entries) {
        cat.entries = [];
      }

      const catname = cat.id;
      for (const check in cat) {
        if (check !== 'amount' && check !== 'title' && typeof entry[check] !== 'undefined') {
          for (const test of cat[check]) {
            if (!entry.found.includes(catname) && entry[check].toString().toLowerCase().includes(test.toLowerCase())) {

              if (entry.creditordebit === 'CRDT') {
                cat.sum += entry.amount;
              } else if (entry.creditordebit === 'DBIT') {
                cat.sum -= entry.amount;
              }
              cat.entries.push(entry);
              entry.found.push(catname);
            }
          }
        }
      }
    }
  }
}
