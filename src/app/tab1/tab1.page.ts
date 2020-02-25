import { Component, OnInit } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  fileNames: string;

  constructor(private filecache: FileCacheService, private route: ActivatedRoute, public modalController: ModalController) {
    this.fileNames = '';
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      if (res.state) {
        this.loadxs2aTransactions(res.state);
      }
    });
  }


  handleFileInput(files: FileList) {
    console.log('Files', files);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'text/xml') {
        this.processXML(files[i]);
      } else {
        console.warn('File not supported');
      }
    }
  }

  ionViewDidEnter() {
    this.fileNames = this.filecache.getFileNames().join(',');
  }

  clearCache() {
    this.filecache.deleteAll();
    this.fileNames = '';
  }

  private processXML(file: File) {
    const xmlReader = new FileReader();
    xmlReader.onload = (e: any) => {
      const xmlContent = e.target.result;
      this.fileNames += ',' + file.name;
      this.filecache.add(new CachedFile(file.name, xmlContent));
    };
    xmlReader.readAsText(file);
  }

  async connectToBank() {
    const response = await fetch('http://localhost:8080/oauth/start');
    const body = await response.json();
    location.href = body.authUrl;
  }

  async loadxs2aTransactions(state: string) {
    let response = await fetch('http://localhost:8080/accounts?state=' + state);
    let body = await response.json();
    const accountList = body.accounts;

    // Load all accounts
    for (const account of accountList) {
      response = await fetch(`http://localhost:8080/accounts/transactions?state=${state}&resourceId=${account.resourceId}`);
      body = await response.text();
      console.log(body);
      this.filecache.add(new CachedFile(account.resourceId + '.xml', body));
    }
  }
}
