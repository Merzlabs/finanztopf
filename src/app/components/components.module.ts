import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MoneyValueBadgeComponent } from './moneyvaluebadge/moneyvaluebadge.component';
import { OpensourceComponent } from './opensource/opensource.component';
import { SumOverviewComponent } from './sum-overview/sum-overview.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { EntrySearchComponent } from './entry-search/entry-search.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { SavingsComponent } from './savings/savings.component';
import { CategoryAssignComponent } from './category-assign/category-assign.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [MoneyValueBadgeComponent, OpensourceComponent, SumOverviewComponent, IntroductionComponent, EntrySearchComponent,
    EntryListComponent, SavingsComponent, CategoryAssignComponent],
  exports: [MoneyValueBadgeComponent, OpensourceComponent, SumOverviewComponent, IntroductionComponent, EntrySearchComponent,
    EntryListComponent, SavingsComponent, CategoryAssignComponent]
})
export class ComponentsModule { }
