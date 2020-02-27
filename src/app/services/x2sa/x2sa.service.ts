import { Injectable } from '@angular/core';
import { FileCacheService, CachedFile } from '../file-cache.service';

@Injectable({
  providedIn: 'root'
})
export class X2saService {

  constructor(private filecache: FileCacheService) { }

  async connectToBank() {
    const response = await fetch('http://localhost:8080/oauth/start');
    const body = await response.json();
    location.href = body.authUrl;
  }

  async loadxs2aTransactions(state: string) {
    let response = await fetch('http://localhost:8080/accounts?state=' + state);
    let body = await response.json();
    const accountList = body.accounts;

    // Load all accounts
    for (const account of accountList) {
      response = await fetch(`http://localhost:8080/accounts/transactions?state=${state}&resourceId=${account.resourceId}`);
      body = await response.text();
      console.log(body);
      this.filecache.add(new CachedFile(account.resourceId + '.xml', body));
    }
  }

}
