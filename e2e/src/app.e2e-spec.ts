import { OnboardingPage, Tab3Page as Tab3Page } from './app.po';

describe('load Intro', () => {
  let page: OnboardingPage;

  beforeEach(() => {
    page = new OnboardingPage();
  });

  it('should display intro', () => {
    page.navigateTo();
    expect(page.getTitle()).toContain('Finanzdaten simpel und schnell auswerten');
  });
});

describe('load Tab3', () => {
  let page: Tab3Page;

  beforeEach(() => {
    page = new Tab3Page();
  });

  it('should display correct title', () => {
    page.navigateTo();
    expect(page.getTitle()).toContain('Finanztöpfe');
  });
});
