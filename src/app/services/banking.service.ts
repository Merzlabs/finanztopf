import { Injectable } from '@angular/core';
import * as RealmWeb from 'realm-web';

import { DataService } from './data.service';

interface Session {
  session_id: string;
  session_id_short: string;
  self: string;
  flows: {
    balances: string;
    transfer: string;
    account_details: string;
    accounts: string;
    transactions: string;
  };

  client_token?: string;
  flow_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BankingService {
  readonly endpoint = 'https://api.playground.openbanking.klarna.com/xs2a/v1';
  app: RealmWeb.App;
  user: RealmWeb.User;
  session: Session;
  private data: any;
  sessionURL: string;

  constructor(private realm: DataService) {
    this.login();
  }

  async login() {
    await this.realm.login();
    this.app = this.realm.getApp();
    this.user = this.realm.getUser();
  }

  async startSession() {
    const res = await this.app.functions.startKlarnaSession();
    this.session = res.data as Session;
    this.sessionURL = res.data.self;
  }

  async startAccountsFlow() {
    const url = this.session.flows.transactions;
    const res = await this.app.functions.startKlarnaFlow(url);
    this.session.client_token = res.data.client_token;
    this.session.flow_id = res.data.flow_id;
    this.session.self = res.data.self;

    if (res.data.state === 'CONSUMER_INPUT_NEEDED') {
      return this.session.client_token;
    } else {
      return undefined;
    }
  }

  async loadData() {
    const res = await this.app.functions.loadKlarna(this.session.self);
    this.data = res.data;
    return res.data;
  }

  getData() {
    return this.data;
  }

  async closeSession() {
    if (this.sessionURL) {
      return await this.app.functions.closeKlarnaSession(this.sessionURL);
    }
  }
}
