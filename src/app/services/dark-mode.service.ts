import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'darkMode';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  public prefersDark: boolean;

  constructor(private storage: Storage) {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.storage.get(STORAGE_KEY).then((value) => {
      if (value === undefined || value === null) {
        // initialize
        this.setDarkTheme(prefersDark.matches);
      } else {
        this.setDarkTheme(value);
      }
    });

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => {
      this.setDarkTheme(mediaQuery.matches);
    });
  }

  // Add or remove the "dark" class based on if the media query matches
  public setDarkTheme(shouldAdd: boolean) {
    // TODO set into localstorage
    this.prefersDark = shouldAdd;
    document.body.classList.toggle('dark', this.prefersDark);
    this.storage.set(STORAGE_KEY, shouldAdd);
  }
}
