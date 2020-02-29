import { Component, OnInit, Input } from '@angular/core';
import { PEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-entry-search',
  templateUrl: './entry-search.component.html',
  styleUrls: ['./entry-search.component.scss'],
})
export class EntrySearchComponent implements OnInit {

  @Input() entries: Array<PEntry>;
  @Input() results: Array<PEntry>;

  constructor() { }

  ngOnInit() {}

  search(ev: CustomEvent) {
    let searchString = ev.detail.value;

    if (!searchString || searchString === '') {
      this.results = [];
      return;
    }

    searchString = searchString.toLowerCase();
    this.results = this.entries.filter((elem) => {
      const propertiesToCheck = ['remittanceInformation', 'creditorName']; // TODO get from categories

      for (const prop of propertiesToCheck) {
        if (typeof elem[prop] !== 'undefined') {
          if (elem[prop].toString().toLowerCase().includes(searchString)) {
            return true;
          }
        }
      }
    });
  }

}
