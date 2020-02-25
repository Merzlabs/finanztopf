import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-moneyvaluebadge',
  templateUrl: './moneyvaluebadge.component.html',
  styleUrls: ['./moneyvaluebadge.component.scss']
})
export class MoneyValueBadgeComponent implements OnInit {

  @Input() value: number;
  @Input() currency: string;
  @Input() badgeSlot: string;
  @Input() credit: boolean;
  @Input() debit: boolean;
  @Input() includePrefix: boolean;

  @Input()
  set creditordebit(value) {
    if (value === 'DBIT') {
      this.debit = true;
    } else if (value === 'CRDT') {
      this.credit = true;
    }
  }

  constructor() { }

  ngOnInit() {}
}
