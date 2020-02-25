import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(public darkModeService: DarkModeService, private router: Router) { }

  get darkMode() {
    return this.darkModeService.prefersDark;
  }

  set darkMode(value: boolean) {
    this.darkModeService.setDarkTheme(value);
  }

  showIntro() {
    this.router.navigateByUrl('/onboarding');
  }

}
