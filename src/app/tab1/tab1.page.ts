import { Component } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  fileNames: string;

  constructor(private filecache: FileCacheService) {
    this.fileNames = '';
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
}
