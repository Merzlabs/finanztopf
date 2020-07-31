import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Category } from '../types/Category';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  loggedIn = false;
  username: string;
  password: string;
  list: Category[];

  constructor(private storage: StorageService, private data: DataService) { }

  ngOnInit() {
  }

  async login() {
    try {
      await this.data.login(this.username, this.password);
      this.loggedIn = true;
      this.load();
    } catch (e) {
      console.error(e);
      alert('Error');
    }
  }

  async load() {
    this.list = await this.storage.getAllAdmin();

    if (this.list === null) {
      alert('No permisssions');
    }
  }

  async update() {
    const res = await this.storage.updateAllAdmin(this.list);
    alert(res);
  }

}
