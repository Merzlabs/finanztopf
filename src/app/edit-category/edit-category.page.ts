import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../types/Category';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  @Input() category: Category;
  condtions: Array<{property: string, filter: Array<string>}>;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.condtions = [];
    for (const prop in this.category) {
      if (this.category.hasOwnProperty(prop) && prop !== 'id' && prop !== 'title' && prop !== 'sum') {
        this.condtions.push({property: prop, filter: this.category[prop]});
      }
    }
    console.debug(this.condtions);
  }

  setValue(event: CustomEvent, property: string, index: number) {
    this.category[property][index] = event.detail.value;
  }

  addCondition() {
    this.condtions.push({property: 'TODO', filter: ['Enthält?']});
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
