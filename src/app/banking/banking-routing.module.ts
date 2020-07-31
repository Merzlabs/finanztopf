import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankingPage } from './banking.page';

const routes: Routes = [
  {
    path: '',
    component: BankingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankingPageRoutingModule {}
