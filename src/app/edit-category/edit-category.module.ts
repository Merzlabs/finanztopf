import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditCategoryPage } from './edit-category.page';
import { FilterPipe } from '../filter-translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: EditCategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditCategoryPage, FilterPipe]
})
export class EditCategoryPageModule {}