import { Component, Input } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage {
  @Input() url: string;
  @Input() duration = 10000;
  @Input() message: string;
  @Input() header: string;
  @Input() color: string;
  @Input() title: string;

  constructor(private toastCtrl: ToastController, private modalCtrl: ModalController) { }

  async copy() {
    navigator.clipboard.writeText(this.url);

    const toast = await this.toastCtrl.create({
      duration: 10000,
      message: `Wenn Sie die URL auf einem anderen Gerät öffnen, werden diese Töpfe geladen.`,
      header: 'Link kopiert',
      color: 'primary'
    });
    toast.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
