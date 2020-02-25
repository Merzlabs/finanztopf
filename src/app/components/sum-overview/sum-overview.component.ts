import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sum-overview',
  templateUrl: './sum-overview.component.html',
  styleUrls: ['./sum-overview.component.scss'],
})
export class SumOverviewComponent implements OnInit {

  @Input() incomeSum: number;
  @Input() outcomeSum: number;
  @Input() currency: string;

  constructor() { }

  ngOnInit() {}

}
