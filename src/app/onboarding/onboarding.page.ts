import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(private router: Router) { }

  @ViewChild(IonSlides)
  slides: IonSlides;

  ngOnInit() {
  }

  async finish() {
    localStorage.set('onboardingDone', true);
    this.router.navigateByUrl('/');
  }

  next() {
    this.slides.slideNext();
  }

  // TODO bind to scroll to allow desktop to scroll through onboarding
  scrolled(event: any) {
    console.log(event);
  }

}
