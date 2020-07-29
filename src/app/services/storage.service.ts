import { Injectable } from '@angular/core';
import * as RealmWeb from 'realm-web';

import { Category } from '../types/Category';
import { UserConfig } from '../types/UserConfig';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  app: RealmWeb.App;
  user: RealmWeb.User;

  constructor(private data: DataService) {
    this.login();
  }

  async login() {
    await this.data.login();
    this.app = this.data.getApp();
    this.user = this.data.getUser();
  }

  async addToStorage(cat: Category) {
    // Clean up!
    cat.sum = 0;
    delete cat.entries;
    cat.owner = this.user.id;

    const res = await this.app.functions.addCategory(cat);
  }

  async getFromStorage(id: string): Promise<Category> {
    const res = await this.app.functions.getCategory(id);
    res.sum = 0;
    return res;
  }

  async getAll(): Promise<Category[]> {
    const res = await this.app.functions.getAllCategories();
    res.sum = 0;
    return res;
  }

  async getAllAdmin(): Promise<Category[]> {
    const res = await this.app.functions.getAllCategoriesAdmin();
    res.sum = 0;
    return res;
  }

  async updateAllAdmin(cats: Category[]): Promise<any> {
    const res = await this.app.functions.updateAllCategoriesAdmin(cats);
    return res;
  }

  async storeConfig(config: UserConfig) {
    config.owner = this.user.id;
    console.debug(config);
    return this.app.functions.storeConfig(config);
  }

  async getConfig(id: string): Promise<UserConfig> {
    return this.app.functions.getConfig(id);
  }
}
