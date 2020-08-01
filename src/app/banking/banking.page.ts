import { Component, OnInit } from '@angular/core';
import { BankingService } from '../services/banking.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

declare var window: any;

@Component({
  selector: 'app-banking',
  templateUrl: './banking.page.html',
  styleUrls: ['./banking.page.scss'],
})
export class BankingPage implements OnInit {
  token: string;
  result: string;

  constructor(private banking: BankingService, private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async login() {
    await this.banking.startSession();
    this.token = await this.banking.startAccountsFlow();
    this.startKlarnaOpenBankingXS2AApp();
  }

  startKlarnaOpenBankingXS2AApp() {
    try {
      // Start the flow with the client_token from the flow response.
      window.XS2A.startFlow(
        this.token,
        {
          onFinished: () => {
            // Read the flow from the server to retrieve the account list.
            this.loadResult();
          },
          onError: error => {
            console.error('onError: something bad happened during the flow.', error);
          },
        }
      );
    } catch (e) {
      // Handle error that happened while opening the App
      console.error(e);
    }
  }

  private async loadResult() {
    const data = await this.banking.loadData();
    this.result = JSON.stringify(data);
    const res = await this.banking.closeSession();
    console.log('Session close', res);
    this.router.navigate(['/tabs/tab3']);
    this.close(res);
  }

  async close(data?: any) {
    if (await this.modalCtrl.getTop()) {
      this.modalCtrl.dismiss(data);
    }
  }

}
