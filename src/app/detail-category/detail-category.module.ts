import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailCategoryPage } from './detail-category.page';
import { MoneyValueBadgeComponent } from '../components/moneyvaluebadge/moneyvaluebadge.component';

const routes: Routes = [
  {
    path: '',
    component: DetailCategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailCategoryPage, MoneyValueBadgeComponent]
})
export class DetailCategoryPageModule {}
