import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MoneyValueBadgeComponent } from './moneyvaluebadge/moneyvaluebadge.component';
import { OpensourceComponent } from './opensource/opensource.component';
import { SumOverviewComponent } from './sum-overview/sum-overview.component';
import { IntroductionComponent } from './introduction/introduction.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [MoneyValueBadgeComponent, OpensourceComponent, SumOverviewComponent, IntroductionComponent],
  exports: [MoneyValueBadgeComponent, OpensourceComponent, SumOverviewComponent, IntroductionComponent]
})
export class ComponentsModule {}
