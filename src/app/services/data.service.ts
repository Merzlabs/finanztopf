import { Injectable } from '@angular/core';
import * as RealmWeb from 'realm-web';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private app: RealmWeb.App;
  private credentials: RealmWeb.Credentials<Realm.Credentials.AnonymousPayload>;
  private user: RealmWeb.User;

  constructor() {
    this.app = new RealmWeb.App({ id: 'finanztopf-cnhkd' });
    this.credentials = RealmWeb.Credentials.anonymous();
    this.login();
  }

  async login(username?: string, password?: string) {
    let forceLogin = false;
    if (username && password) {
      this.credentials = RealmWeb.Credentials.emailPassword(username, password);
      forceLogin = true;
    }

    if (!this.user || forceLogin) {
      console.log('Login', this.credentials);
      try {
        // Authenticate the user
        this.user  = await this.app.logIn(this.credentials);
      } catch (err) {
        console.error('Failed to log in', err);
        throw err;
      }
    }
  }

  getApp() {
    return this.app;
  }

  getUser() {
    return this.user;
  }
}
