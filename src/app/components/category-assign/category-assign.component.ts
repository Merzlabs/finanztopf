import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PecuniatorEntry } from '@merzlabs/pecuniator-api';
import { ModalController } from '@ionic/angular';
import { AssignPage } from 'src/app/assign/assign.page';
import { Category } from 'src/app/types/Category';

@Component({
  selector: 'app-category-assign',
  templateUrl: './category-assign.component.html',
  styleUrls: ['./category-assign.component.scss'],
})
export class CategoryAssignComponent implements OnInit {

  @Input() entries: PecuniatorEntry[];
  @Output() addCategories = new EventEmitter<Category[]>();

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  // TODO delete after pecuniator api change
  /**
   * Checks if an entry is debit or credit
   * Should be replaced by clearer typed pecuniator method/attribute
   * @param entry Pecuniator Entry
   */
  isDebt(entry: PecuniatorEntry): boolean | null {
    let isDebit = null;
    // TODO smarter way for pecuniator to strongly type tell if credit or debit transaction
    if (entry.creditordebit === 'CRDT') {
        isDebit = false;
    } else if (entry.creditordebit === 'DBIT') {
        isDebit = true;
    }
    return isDebit;
  }


  get incomeSum(): number {
    let sum = 0.0;
    if (!this.entries || this.entries.length === 0) {
        return sum;
    }
    this.entries.forEach((entry) => {
        if (!this.isDebt(entry)) {
            sum += entry.amount;
        }
    });
    return sum;
  }

  get expenseSum(): number {
    let sum = 0.0;
    if (!this.entries || this.entries.length === 0) {
        return sum;
    }
    this.entries.forEach((entry) => {
        if (this.isDebt(entry)) {
            sum += entry.amount;
        }
    });
    return sum;
  }

  async assign(entry: PecuniatorEntry) {
    const modal = await this.modalCtrl.create({
      component: AssignPage,
      swipeToClose: true,
      componentProps: {
        entry
      }
    });

    modal.onDidDismiss().then((value) => {
      if (value?.data?.length > 0) {
        this.addCategories.emit(value.data);
      }
    });

    modal.present();
  }

}
