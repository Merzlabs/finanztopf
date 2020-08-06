import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss'],
})
export class SavingsComponent implements OnInit {
  static readonly IGNOREIBAN = 'ignoreIBAN';
  static readonly IGNORECREDITOR = 'ignoreCreditor';
  static readonly IGNOREDEBTOR = 'ignoreDebtor';
  iban: string;
  creditor: string;
  debtor: string;

  constructor() { }

  ngOnInit() {
    this.iban = localStorage.getItem(SavingsComponent.IGNOREIBAN);
    this.creditor = localStorage.getItem(SavingsComponent.IGNORECREDITOR);
    this.creditor = localStorage.getItem(SavingsComponent.IGNOREDEBTOR);
  }

  saveIbans(event: any) {
    const value = event.detail?.value;
    if (typeof value === 'string') {
      localStorage.setItem(SavingsComponent.IGNOREIBAN, value);
    }
  }

  saveCreditors(event: any) {
    const value = event.detail?.value;
    if (typeof value === 'string') {
      localStorage.setItem(SavingsComponent.IGNORECREDITOR, value);
    }
  }

  saveDebtors(event: any) {
    const value = event.detail?.value;
    if (typeof value === 'string') {
      localStorage.setItem(SavingsComponent.IGNOREDEBTOR, value);
    }
  }

}
