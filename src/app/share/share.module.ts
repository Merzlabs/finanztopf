import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';

import { SharePageRoutingModule } from './share-routing.module';

import { SharePage } from './share.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharePageRoutingModule,
    QRCodeModule
  ],
  declarations: [SharePage]
})
export class SharePageModule {}
