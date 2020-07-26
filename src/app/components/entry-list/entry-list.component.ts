import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {

  @Input() entries: Array<PEntry>;
  @Output() entryClicked = new EventEmitter<PEntry>();

  constructor() { }

  ngOnInit() {}

  click(entry: PEntry) {
    this.entryClicked.emit(entry);
  }

}
