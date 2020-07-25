import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Expense } from 'src/app/types/Expense';

@Component({
  selector: 'app-sum-overview',
  templateUrl: './sum-overview.component.html',
  styleUrls: ['./sum-overview.component.scss'],
})
export class SumOverviewComponent implements OnInit {

  @Input() incomeSum: number;
  @Input() outcomeSum: number;
  @Input() currency: string;
  @Input() expenses: Array<Expense>;

  @Output() incomeClicked: EventEmitter<void> = new EventEmitter();
  @Output() outcomeClicked: EventEmitter<void> = new EventEmitter();
  @Output() expenseClicked: EventEmitter<Expense> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  incomeClick() {
    this.incomeClicked.emit();
  }

  outcomeClick() {
    this.outcomeClicked.emit();
  }

  expenseClick(expense: Expense) {
    this.expenseClicked.emit(expense);
  }

}
