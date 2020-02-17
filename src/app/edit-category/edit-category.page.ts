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

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.debug(this.category);
  }


  close() {
    this.modalCtrl.dismiss();
  }

}
