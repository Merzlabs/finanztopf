import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OnboardingPage } from './onboarding.page';
import { IntroductionComponent } from '../components/introduction/introduction.component';
import { OpensourceComponent } from '../components/opensource/opensource.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OnboardingPage, IntroductionComponent, OpensourceComponent]
})
export class OnboardingPageModule {}
