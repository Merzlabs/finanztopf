import { Injectable } from '@angular/core';

import * as JSZip from 'jszip';

export class CachedFile {
  constructor(public name: string, public content: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class FileCacheService {
  private files: Array<CachedFile>;

  constructor() {
    this.files = [];
  }

  get fileNames() {
    return this.files.map((elem) => elem.name);
  }

  get fileNameStringConcat() {
    if (this.fileNames.length === 0) {
      return '';
    }
    return this.fileNames.join(',');
  }

  async loadFiles(files: FileList) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'text/xml') {
        this.processXMLFile(files[i]);
      } else if (files[i].type === 'application/zip') {
        const newFileZipObject = await JSZip.loadAsync(files[i]);

        newFileZipObject.forEach(async (path, file) => {
          // filename check not ideal only temp solution till find out type other way
          if (path.endsWith('.xml')) {
            const xmlContent: string = await file.async('string');
            let name = path;

            const splitPath = path.split('/');
            if (splitPath.length > 0) {
              name = splitPath[splitPath.length - 1];
            }
            this.add(new CachedFile(name, xmlContent));
          } else {
            console.warn('Unzipped File not supported', path);
          }
        });
      } else {
        console.warn('File not supported:', files[i].name);
      }
    }
  }

  private processXMLFile(file: File) {
    const xmlReader = new FileReader();
    xmlReader.onload = (e: any) => {
      const xmlContent = e.target.result;
      this.add(new CachedFile(file.name, xmlContent));
    };
    xmlReader.readAsText(file);
  }

  add(file: CachedFile) {
    this.files.push(file);
  }

  getAll() {
    return this.files;
  }

  deleteAll() {
    this.files = [];
  }

}
