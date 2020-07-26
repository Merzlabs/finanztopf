import { Component, OnInit, Input } from '@angular/core';
import { PEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-category-assign',
  templateUrl: './category-assign.component.html',
  styleUrls: ['./category-assign.component.scss'],
})
export class CategoryAssignComponent implements OnInit {

  @Input() entries: PEntry[];

  constructor() { }

  ngOnInit() {}

}
