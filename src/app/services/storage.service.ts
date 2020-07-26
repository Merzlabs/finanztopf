import { Injectable } from '@angular/core';
import * as RealmWeb from 'realm-web';

import { Category } from '../types/Category';

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

  private async login() {
    try {
      // Authenticate the user
      this.user  = await this.app.logIn(this.credentials);
      // `App.currentUser` updates to match the logged in user
      if (this.user.id !== this.app.currentUser.id) {
        throw new Error('USERFAILED');
      }
    } catch (err) {
      console.error('Failed to log in', err);
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
}
