import { Injectable } from '@angular/core';
import * as RealmWeb from 'realm-web';

import { Category } from '../types/Category';
import { UserConfig } from '../types/UserConfig';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  app: RealmWeb.App;
  credentials: RealmWeb.Credentials<Realm.Credentials.AnonymousPayload>;
  user: RealmWeb.User;

  constructor() {
    this.app = new RealmWeb.App({ id: 'finanztopf-cnhkd' });
    this.credentials = RealmWeb.Credentials.anonymous();
    this.login();
  }

  async login(username?: string, password?: string) {
    if (username && password) {
      this.credentials = RealmWeb.Credentials.emailPassword(username, password);
    } else if (!this.user) {
      try {
        // Authenticate the user
        this.user  = await this.app.logIn(this.credentials);
      } catch (err) {
        console.error('Failed to log in', err);
        throw err;
      }
    }
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
    return this.app.functions.storeConfig(config);
  }

  async getConfig(id: string): Promise<UserConfig> {
    return this.app.functions.getConfig(id);
  }
}
