import { Component, OnInit, Input } from '@angular/core';
import { PecuniatorEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-entry-search',
  templateUrl: './entry-search.component.html',
  styleUrls: ['./entry-search.component.scss'],
})
export class EntrySearchComponent implements OnInit {

  @Input() entries: Array<PecuniatorEntry>;
  @Input() results: Array<PecuniatorEntry>;
  private searchString: string;

  private MAX_EMPTY_ENTRIES = 10;

  constructor() { }

  ngOnInit() {}

  private showFirst() {
    // show last 9 transactions of all entries if focussed without input or empty search
    this.results = this.entries.sort((a, b) => {
      if (a.bookingDate > b.bookingDate) {
        return -1;
      } else if (a.bookingDate < b.bookingDate) {
        return 1;
      }
      return 0;
    }).slice(0, this.MAX_EMPTY_ENTRIES);
  }

  focusSearch(ev: CustomEvent) {
    this.showFirst();
  }

  blurSearch(ev: any) {
    if (!this.searchString || this.searchString.trim().length === 0) {
      this.results = null;
    }
  }

  search(ev: CustomEvent) {
    this.searchString = ev.detail.value;

    if (!this.searchString || this.searchString === '') {
      return this.showFirst();
    }

    this.searchString = this.searchString.toLowerCase();
    this.results = this.entries.filter((elem) => {
      const propertiesToCheck = ['remittanceInformation', 'creditorName']; // TODO get from categories

      for (const prop of propertiesToCheck) {
        if (typeof elem[prop] !== 'undefined') {
          if (elem[prop].toString().toLowerCase().includes(this.searchString)) {
            return true;
          }
        }
      }
    });
  }

}
