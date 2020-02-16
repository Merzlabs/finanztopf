import { Injectable } from '@angular/core';

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

  add(file: CachedFile) {
    this.files.push(file);
  }

  getAll() {
    return this.files;
  }

  getFileNames() {
    return this.files.map((elem) => elem.name);
  }

  deleteAll() {
    this.files = [];
  }

}
