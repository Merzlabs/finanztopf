import { Component, OnInit } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { X2saService } from '../services/x2sa/x2sa.service';
import { BankingPage } from '../banking/banking.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    public filecache: FileCacheService,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    public x2saService: X2saService,
    private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      if (res.state) {
        this.x2saService.loadxs2aTransactions(res.state);
      }
    });
  }

  handleFileInput(files: FileList) {
    console.log('Files', files);
    this.filecache.loadFiles(files);
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
        this.router.navigate(['/tabs/tab3']);
      }
    });

    modal.present();
  }

}
