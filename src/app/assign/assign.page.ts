import { Component, OnInit, Input } from '@angular/core';
import { PEntry } from '@merzlabs/pecuniator-api';
import { StorageService } from '../services/storage.service';
import { Category } from '../types/Category';
import { CategoryService } from '../services/category.service';
import { ModalController } from '@ionic/angular';

class CategorySelect extends Category {
  isChecked?: boolean;
  subtile?: string;
}

@Component({
  selector: 'app-assign',
  templateUrl: './assign.page.html',
  styleUrls: ['./assign.page.scss'],
})
export class AssignPage implements OnInit {

  @Input() entry: PEntry;
  allCategories: Category[];
  suggestions: CategorySelect[];

  constructor(private storage: StorageService, private category: CategoryService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.allCategories = await this.storage.getAll();

    this.category.checkCategories(this.entry, this.allCategories);

    this.suggestions = this.allCategories.filter((elem) => elem.entries?.length > 0);
    this.suggestions.forEach((elem) => {
      elem.subtile = '';
      if (elem?.creditorName?.length > 0) {
        elem.subtile += 'Kreditor: ';
        elem.subtile += elem.creditorName.join(',');
      }

      if (elem?.remittanceInformation?.length > 0) {
        elem.subtile += 'Verwend.: ';
        elem.subtile += elem.remittanceInformation.join(',');
      }
    });
  }

  dismiss(data?: CategorySelect[]) {
    this.modalCtrl.dismiss(data);
  }

  add() {
    const addCategories = this.suggestions.filter((elem) => elem.isChecked);
    this.dismiss(addCategories);
  }

}
