import { Injectable } from '@angular/core';

import * as JSZip from 'jszip';
import { NgxIndexedDBService } from 'ngx-indexed-db';

export class CachedFile {
  public hash: string;

  constructor(public name: string, public content: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class FileCacheService {
  private files: Array<CachedFile>;

  constructor(private dbService: NgxIndexedDBService) {
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

  /**
   * Check if file exists and add if not.
   * @return true if file has been added to db and is not duplicate
   */
  private async storeToDB(file: CachedFile): Promise<boolean> {
    try {
      const key = await this.digestMessage(file.content);

      const exists = await this.dbService.getByKey('files', key);
      if (!exists) {
        await this.dbService.add('files', file, key);
        return true;
      }
    } catch (e) {
      console.error('Error storing', file, e);
    }

    return false;
  }

  async loadFromDB() {
    try {
      const all = await this.dbService.getAll('files') as CachedFile[];
      if (all) {
        all.forEach((elem) => this.add(elem));
      }
    } catch (e) {
      console.error('Load error', e);
    }
  }

  async deleteDatabase() {
    await this.dbService.clear('files');
  }

  /**
   * Hash data
   * See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
   */
  private async digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }
}
