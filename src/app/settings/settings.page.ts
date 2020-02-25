import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(public darkModeService: DarkModeService) { }

  get darkMode() {
    return this.darkModeService.prefersDark;
  }

  set darkMode(value: boolean) {
    this.darkModeService.setDarkTheme(value);
  }

}
