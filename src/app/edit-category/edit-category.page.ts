import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../types/Category';
import { ModalController, AlertController } from '@ionic/angular';
import { Filters } from '../types/Filter';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  @Input() category: Category;
  condtions: Array<{property: string, filter: Array<string>}>;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.condtions = [];
    for (const prop in this.category) {
      if (this.category.hasOwnProperty(prop) && prop !== 'id' && prop !== 'title' && prop !== 'sum' && prop !== 'entries') {
        this.condtions.push({property: prop, filter: this.category[prop]});
      }
    }
    console.debug(this.condtions);
  }

  setValue(event: CustomEvent, property: string, index?: number) {
    if (typeof this.category[property] === 'undefined') {
      this.category[property] = [];
    }

    const value = event.detail.value;
    if (value === '') {
      this.category[property].splice(index, 1);
    } else {
      if (typeof index === 'undefined') {
        this.category[property].push(value);
      } else {
        this.category[property][index] = value;
      }
    }
  }

  async addCondition() {
    const inputs = [];
    let checked = true;
    for (const f in Filters) {
      if (typeof Filters[f] === 'string') {
          inputs.push({
            name: f,
            type: 'radio',
            label: Filters[f],
            value: f,
            checked
          });
          checked = false;
      }
  }

    const alert = await this.alertCtrl.create({
      header: 'Radio',
      inputs,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Ignore
          }
        }, {
          text: 'Ok',
          handler: (value) => {
            console.log('Confirm Ok', value);

            const newCondition = {property: value, filter: ['Enthält?']};
            this.condtions.push(newCondition);
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}