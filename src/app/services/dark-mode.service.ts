import { Injectable } from '@angular/core';

const STORAGE_KEY = 'darkMode';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  public prefersDark: boolean;

  constructor() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const value = localStorage.getItem(STORAGE_KEY);
    if (value === undefined || value === null) {
      // initialize
      this.setDarkTheme(prefersDark.matches);
    } else {
      this.setDarkTheme(value === 'true');
    }

    // Listen for changes to the prefers-color-scheme media query
    // iOS Problems
    // prefersDark.addEventListener('change', (mediaQuery) => {
    //  this.setDarkTheme(mediaQuery.matches);
    // });
  }

  // Add or remove the "dark" class based on if the media query matches
  public setDarkTheme(shouldAdd: boolean) {
    // TODO set into localstorage
    this.prefersDark = shouldAdd;
    document.body.classList.toggle('dark', this.prefersDark);
    localStorage.setItem(STORAGE_KEY, String(shouldAdd));
  }
}
