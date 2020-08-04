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
    // TODO make PecunatiorEntry creditordebit enum value type stronger or similiar
    if (entry.creditordebit === 'DBIT') {
      return entry.creditorName;
    } else if (entry.creditordebit === 'CRDT') {
      return entry.debtorName;
    }
  }

  click(entry: PecuniatorEntry) {
    this.entryClicked.emit(entry);
  }

}
