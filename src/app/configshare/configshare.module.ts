import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';

import { ConfigsharePageRoutingModule } from './configshare-routing.module';

import { ConfigsharePage } from './configshare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigsharePageRoutingModule,
    QRCodeModule
  ],
  declarations: [ConfigsharePage]
})
export class ConfigsharePageModule {}
