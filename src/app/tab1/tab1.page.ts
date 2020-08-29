import { Component, OnInit } from '@angular/core';
import { FileCacheService } from '../services/file-cache.service';
import { ActivatedRoute} from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { X2saService } from '../services/x2sa/x2sa.service';
import { BankingPage } from '../banking/banking.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  enableSave: boolean;

  constructor(
    public filecache: FileCacheService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    public x2saService: X2saService,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      if (res.state) {
        this.x2saService.loadxs2aTransactions(res.state);
      }
    });

    this.enableSave = localStorage.getItem('saveEnabled') === 'true';
    if (this.enableSave) {
      this.filecache.loadFromDB();
    }
  }

  handleFileInput(files: FileList) {
    console.log('Files', files);
    this.filecache.loadFiles(files, this.enableSave);
  }

  ionViewDidEnter() {
  }

  clearCache() {
    this.filecache.deleteAll();
  }

  async openBanking() {
    const modal = await this.modalCtrl.create({
      component: BankingPage,
      swipeToClose: true
    });

    modal.onDidDismiss().then((value) => {
      if (value?.data) {
        // navigate used to be here
      }
    });

    modal.present();
  }

  saveSetting() {
    localStorage.setItem('saveEnabled', JSON.stringify(this.enableSave));
  }

  async deleteDatabase() {
    try {
      await this.filecache.deleteDatabase();
      const toast = await this.toastCtrl.create({
        duration: 3000,
        message: `Daten gelöscht`,
        color: 'primary'
      });
      toast.present();
    } catch (e) {
      console.error('Delete error', e);
    }
  }
}
