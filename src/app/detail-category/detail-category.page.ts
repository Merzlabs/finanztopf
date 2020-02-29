import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PEntry } from '@merzlabs/pecuniator-api';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.page.html',
  styleUrls: ['./detail-category.page.scss'],
})
export class DetailCategoryPage implements OnInit {

  @Input() entries: Array<PEntry>;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
