import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankingPageRoutingModule } from './banking-routing.module';

import { BankingPage } from './banking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankingPageRoutingModule
  ],
  declarations: [BankingPage]
})
export class BankingPageModule {}
