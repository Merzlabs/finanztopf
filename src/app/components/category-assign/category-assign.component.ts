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
