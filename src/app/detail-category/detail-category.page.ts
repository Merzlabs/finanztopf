import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../types/Category';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.page.html',
  styleUrls: ['./detail-category.page.scss'],
})
export class DetailCategoryPage implements OnInit {

  @Input() category: Category;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
