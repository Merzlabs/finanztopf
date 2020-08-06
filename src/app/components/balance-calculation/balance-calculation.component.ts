import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-balance-calculation',
  templateUrl: './balance-calculation.component.html',
  styleUrls: ['./balance-calculation.component.scss'],
})
export class BalanceCalculationComponent implements OnInit {

  @Input() incomeSum: number;
  @Input() expenseSum: number;
  @Input() currency: string;

  constructor() { }

  ngOnInit() {}

}
