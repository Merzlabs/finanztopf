import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PecuniatorEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {

  @Input() entries: Array<PecuniatorEntry>;
  @Output() entryClicked = new EventEmitter<PecuniatorEntry>();

  constructor() { }

  ngOnInit() {}

  creditorDebtor(entry: PecuniatorEntry) {
    if (entry.isDebit) {
      return entry.creditorName;
    } else if (entry.isCredit) {
      return entry.debtorName;
    }
  }

  creditorDebtorIBAN(entry: PecuniatorEntry) {
    if (entry.isDebit) {
      return entry.creditorIBAN;
    } else if (entry.isCredit) {
      return entry.debtorIBAN;
    }
  }

  click(entry: PecuniatorEntry) {
    this.entryClicked.emit(entry);
  }

}
