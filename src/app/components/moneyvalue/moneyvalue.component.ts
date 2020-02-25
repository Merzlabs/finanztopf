import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-moneyvalue',
  templateUrl: './moneyvalue.component.html',
  styleUrls: ['./moneyvalue.component.scss'],
})
export class MoneyValueComponent implements OnInit {

  @Input() name: string;
  @Input() value: number;
  @Input() currency: string;
  // TODO slot type enum
  @Input() badgeSlot: string;
  @Input() note?: string;

  constructor() { }

  ngOnInit() {}
}
