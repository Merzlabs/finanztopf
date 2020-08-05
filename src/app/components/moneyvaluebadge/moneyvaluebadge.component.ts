import { Component, OnInit, Input } from '@angular/core';

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
  @Input() typeByValue: boolean;
  @Input() includePrefix: boolean;
  @Input() manualPrefix = '';

  @Input()
  set creditordebit(value) {
    if (value === 'DBIT') {
      this.debit = true;
    } else if (value === 'CRDT') {
      this.credit = true;
    }
  }

  constructor() { }

  ngOnInit() {
    if (this.typeByValue) {
      this.debit = this.value < 0;
      this.credit = this.value >= 0;
      this.value = Math.abs(this.value);
    }
  }
}
