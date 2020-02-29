import { Component, OnInit, Input } from '@angular/core';
import { PEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {

  @Input() entries: Array<PEntry>;

  constructor() { }

  ngOnInit() {}

}
