import { Component, OnInit, Input } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-configshare',
  templateUrl: './configshare.page.html',
  styleUrls: ['./configshare.page.scss'],
})
export class ConfigsharePage implements OnInit {
  url: string;

  constructor(private toastCtrl: ToastController, private modalCtrl: ModalController) { }

  @Input() id: string;

  ngOnInit() {
    const url = location.href.replace(location.search, '');
    this.url = url + '?config=' + this.id;
  }

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
