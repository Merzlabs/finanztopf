import { Injectable } from '@angular/core';
import { CSARFile, CSARStorageClient } from '@merzlabs/csar-client';

import * as JSZip from 'jszip';

export class CachedFile extends CSARFile {
  public hash?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileCacheService {
  private files: Array<CachedFile>;
  private db: CSARStorageClient;

  constructor() {
    this.files = [];

    this.db = new CSARStorageClient('Pecuniator');
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

  async loadFiles(files: FileList|File[], save = false) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'text/xml') {
        this.processXMLFile(files[i], save);
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
            this.add(new CachedFile(name, xmlContent), save);
          } else {
            console.warn('Unzipped File not supported', path);
          }
        });
      } else {
        console.warn('File not supported:', files[i].name);
      }
    }
  }

  private processXMLFile(file: File, save) {
    const xmlReader = new FileReader();
    xmlReader.onload = (e: any) => {
      const xmlContent = e.target.result;
      this.add(new CachedFile(file.name, xmlContent), save);
    };
    xmlReader.readAsText(file);
  }

  async add(file: CachedFile, save = false) {
    if (save) {
      const added = await this.storeToDB(file);

      if (added) {
        this.files.push(file);
      }
    } else {
      this.files.push(file);
    }
  }

  getAll() {
    return this.files;
  }

  deleteAll() {
    this.files = [];
  }

  private async storeToDB(file: CachedFile): Promise<boolean> {
    return this.db.store(file);
  }

  async loadFromDB() {
      try {
      const all = await this.db.load();
      console.debug(all);
      if (all) {
        all.forEach((elem) => this.add(elem));
      }
    } catch (e) {
      console.error('Load error', e);
    }
  }

  async deleteDatabase() {
    await this.db.clear();
    this.deleteAll();
  }
}
