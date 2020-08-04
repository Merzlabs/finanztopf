import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Month } from 'src/app/types/Month';

@Component({
  selector: 'app-sum-overview',
  templateUrl: './sum-overview.component.html',
  styleUrls: ['./sum-overview.component.scss'],
})
export class SumOverviewComponent implements OnInit {

  @Input() incomeSum: number;
  @Input() outcomeSum: number;
  @Input() savingsSum: number;
  @Input() currency: string;
  @Input() months: Array<Month>;

  @Output() incomeClicked: EventEmitter<void> = new EventEmitter();
  @Output() outcomeClicked: EventEmitter<void> = new EventEmitter();
  @Output() monthClicked: EventEmitter<Month> = new EventEmitter();
  @Output() savingsClicked: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  incomeClick() {
    this.incomeClicked.emit();
  }

  outcomeClick() {
    this.outcomeClicked.emit();
  }

  monthClick(month: Month) {
    this.monthClicked.emit(month);
  }

  savingsClick() {
    this.savingsClicked.emit();
  }

}
