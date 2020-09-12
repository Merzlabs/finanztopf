import { Injectable } from '@angular/core';
import { CSARSyncClient } from '@merzlabs/csar-client';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  client: CSARSyncClient;

  constructor() { }

  setup(id?: string): string {
    this.client = new CSARSyncClient('https://connect.pecuniator.com');
    if (!id) {
      id = this.client.randomId();
      this.client.isSender = true;
    }
    this.client.register(id);

    this.client.onMessage().subscribe((data) => console.log('Subscription', data));
    return id;
  }

  send(data) {
    this.client.sendData(data);
  }

  onMessage() {
    return this.client.onMessage();
  }

  onReady() {
    return this.client.onReady();
  }
}
