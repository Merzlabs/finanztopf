import { Component, ViewChild } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { PecuniAPI } from 'pecuniator-api/main';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  private files: CachedFile[];
  api: PecuniAPI;
  @ViewChild('comp') mycomponent: any;

  constructor(private filecache: FileCacheService) {
    this.api = new PecuniAPI();
  }

  ionViewWillEnter() {
    // Reset api instance of this page from files in cache every time
    this.api.clear();
    this.files = this.filecache.getAll();
    if (typeof this.files !== 'undefined' && this.files.length > 0) {
      for (const file of this.files) {
        this.api.load(file.content);
      }
    }
    this.mycomponent.nativeElement.refresh();
  }

}
