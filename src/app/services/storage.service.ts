import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/storage';

import { Category } from '../types/Category';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  app: firebase.app.App;
  storage: firebase.storage.Storage;

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDQAnVnwZQ9rGIt5LZP9_S0lTFkyxY685A',
      authDomain: 'merzlabs-pecuniator.firebaseapp.com',
      databaseURL: 'https://merzlabs-pecuniator.firebaseio.com',
      projectId: 'merzlabs-pecuniator',
      storageBucket: 'merzlabs-pecuniator.appspot.com',
      messagingSenderId: '344072257495',
      appId: '1:344072257495:web:04dd4820921dd7b5069592'
    };

    this.app = firebase.initializeApp(firebaseConfig);
    this.storage = firebase.storage();
  }

  addToStorage(cat: Category) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child('toepfe/' + cat.id + '.json');
    return fileRef.putString(JSON.stringify(cat));
  }

  async getFromStorage(id: string): Promise<any> {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child('toepfe/' + id + '.json');

    try {
        const url = await fileRef.getDownloadURL();
        const response = await fetch(url);
        return response.json();
    } catch (e) {
        throw e;
    }
  }
}
