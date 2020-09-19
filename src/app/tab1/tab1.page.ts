import { Component, OnInit } from '@angular/core';
import { FileCacheService } from '../services/file-cache.service';
import { ActivatedRoute} from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { X2saService } from '../services/x2sa/x2sa.service';
import { BankingPage } from '../banking/banking.page';
import { SyncService } from '../services/sync.service';
import { SharePage } from '../share/share.page';

declare var window: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  enableSave: boolean;
  pairingCode: string;
  hasNativeFS: boolean;

  constructor(
    public filecache: FileCacheService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    public x2saService: X2saService,
    private toastCtrl: ToastController,
    private sync: SyncService) {
    this.hasNativeFS = 'chooseFileSystemEntries' in window ||
              'showOpenFilePicker' in window;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      if (res.state) {
        this.x2saService.loadxs2aTransactions(res.state);
      }

      if (res.pairingCode) {
        this.enableSave = true;
        this.pairingCode = res.pairingCode;
        this.pairAndSync();
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

  async pairAndSync() {
    if (!this.pairingCode) {
      this.pairingCode = this.sync.setup();
      const all = this.filecache.getAll();
      this.sync.onReady().subscribe(() => all.forEach((elem) => this.sync.send(JSON.stringify(elem))));

      let url = location.href.replace(location.search, '');
      url = url + '?pairingCode=' + this.pairingCode;
      const modal = await this.modalCtrl.create({
        component: SharePage,
        swipeToClose: true,
        componentProps: {
            url,
            title: 'Daten an anderes Gerät übertragen',
            message: `Wenn Sie die URL auf einem anderen Gerät werden Ihre Transaktionen übertragen.
            Der Pairing Code für die Manuelle Eingabe lautet: "${this.pairingCode}"`,
            header: 'Link kopiert',
            color: 'primary',
            duration: 10000,
        }
      });
      modal.present();

    } else {
      this.sync.setup(this.pairingCode);
      this.sync.onMessage().subscribe((data) => this.filecache.add(JSON.parse(data), true));
    }

  }

  // Native file system

  async openDirectory() {
    const opts = {type: 'open-directory'};
    const handle = await window.chooseFileSystemEntries(opts);
    const entries = await handle.getEntries();
    const files: File[] = [];
    for await (const entry of entries) {
      const file = await entry.getFile();
      files.push(file);
    }
    this.filecache.loadFiles(files, this.enableSave);
  }

  async exportToFiles() {
    /* const opts = {
      type: 'save-file',
      accepts: [{
        description: 'Text file',
        extensions: ['txt'],
        mimeTypes: ['text/plain'],
      }],
    }; */
    const opts = {type: 'open-directory'};
    const directoryHandle = await window.chooseFileSystemEntries(opts);

    const all = this.filecache.getAll();
    for (const file of all) {
      const fileHandle = await directoryHandle.getFile(file.name, {create: true});
      const writable = await fileHandle.createWritable();
      // Write the contents of the file to the stream.
      await writable.write(file.content);
      // Close the file and write the contents to disk.
      await writable.close();
    }
  }

}
