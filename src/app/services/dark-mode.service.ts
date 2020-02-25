import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  public prefersDark: boolean;

  constructor() {
      // TODO load from settings in localstorage
    // if (unset){}
    this.initialize();
  }

  private initialize() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.setDarkTheme(prefersDark.matches);
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
  }
}
