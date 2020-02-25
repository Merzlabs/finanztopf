import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(private storage: Storage, private router: Router) { }

  @ViewChild(IonSlides)
  slides: IonSlides;

  ngOnInit() {
  }

  async finish() {
    await this.storage.set('onboardingDone', true);
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
