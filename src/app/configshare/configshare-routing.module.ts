import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigsharePage } from './configshare.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigsharePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigsharePageRoutingModule {}
