import { Injectable } from '@angular/core';
import { CSARClient } from '@merzlabs/csar-client';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  client: CSARClient;

  constructor() { }

  setup(id?: string): string {
    this.client = new CSARClient('https://connect.pecuniator.com');
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
