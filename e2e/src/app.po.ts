import { browser, by, element, until } from 'protractor';

abstract class AppPage {
  readonly url: string;

  navigateTo() {
    return browser.get(this.url);
  }

  abstract getTitle();
}

export class OnboardingPage extends AppPage {
  readonly url = '/';

  getTitle() {
    browser.wait(until.elementLocated(by.className('introduction-title')), 1000);
    return element(by.className('introduction-title')).getText();
  }
}

export class Tab3Page extends AppPage {
  readonly url = '/tabs/tab3';

  getTitle() {
    return element(by.css('ion-title')).getText();
  }
}
