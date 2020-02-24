import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../types/Category';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Filters } from '../types/Filter';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  @Input() category: Category;
  condtions: Array<{property: string, filter: Array<string>}>;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private storage: StorageService,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.buildConditions();
  }

  private buildConditions() {
    this.condtions = [];
    for (const prop in this.category) {
      if (this.category.hasOwnProperty(prop) && prop !== 'id' && prop !== 'title' && prop !== 'sum' && prop !== 'entries') {
        this.condtions.push({ property: prop, filter: this.category[prop] });
      }
    }
  }

  setValue(event: CustomEvent, property: string, oldValue?: string) {
    if (typeof this.category[property] === 'undefined') {
      this.category[property] = [];
    }

    const value = event.detail.value;
    const index = this.category[property].indexOf(oldValue);
    if (value === '') {
      this.category[property].splice(index, 1);
    } else {
      if (index >= 0) {
        this.category[property][index] = value;
      } else {
        // Should never happen
        console.error('Value not found');
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

            if (this.category[value] instanceof Array) {
              this.category[value].push('Enthält?');
            } else {
              this.category[value] = ['Enthält?'];
            }

            this.buildConditions();
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  share() {
    this.storage.addToStorage(this.category).then(async () => {
      const toast = await this.toastCtrl.create({
        duration: 5000,
        message: `Topf mit der ID "${this.category.id}" zum Teilen verfügbar.`,
        header: 'Speichern erfolgreich',
        color: 'primary',
        buttons: [
          {
            side: 'end',
            icon: 'clipboard',
            text: 'Kopieren',
            handler: () => {
              const url = location.href.replace(location.search, '');
              navigator.clipboard.writeText(url + '?load=' + this.category.id);
            }
          }
        ]
      });
      toast.present();
    });
  }
}
