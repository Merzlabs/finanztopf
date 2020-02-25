import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PecuniAPI, PEntry } from '@merzlabs/pecuniator-api';
import { ModalController, IonList, AlertController, ToastController } from '@ionic/angular';

import { EditCategoryPage } from '../edit-category/edit-category.page';
import { Category } from '../types/Category';
import { DetailCategoryPage } from '../detail-category/detail-category.page';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { StorageService } from '../services/storage.service';

/**
 * Just for categorizing one field added
 */
class CheckEntry extends PEntry {
    found: Array<string>;
}

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
    private files: CachedFile[];
    api: PecuniAPI;
    incomeSum: number;
    outcomeSum: number;
    categories: Array<Category>;
    @ViewChild('categorylist') list: IonList;
    querySubscription: Subscription;
    currency: string;

    constructor(private filecache: FileCacheService, private modalCtrl: ModalController, private alertCtrl: AlertController,
                private storage: StorageService, private toastCtrl: ToastController, private route: ActivatedRoute) {
        this.api = new PecuniAPI();

        const savedCategories = localStorage.getItem('userCategories');
        if (savedCategories && savedCategories !== '') {
            this.categories = JSON.parse(savedCategories);
        } else {
            this.categories = [
                {
                    creditorName: ['Tank'],
                    sum: 0,
                    title: 'Tanken',
                    id: 'fuel',
                    entries: [],
                },
                {
                    remittanceInformation: ['Versicherung'],
                    sum: 0,
                    title: 'Versicherung',
                    id: 'insu',
                    entries: [],
                },
                {
                    creditorName: ['Paypal'],
                    sum: 0,
                    title: 'Onlinetransaktionen',
                    id: 'online',
                    entries: [],
                },
                {
                    creditorName: ['Drillisch', 'Telekom'],
                    sum: 0,
                    title: 'Handy',
                    id: 'cell',
                    entries: [],
                },
            ];
        }
    }

    ionViewWillEnter() {
        // Reset api instance of this page from files in cache every time
        this.api.clear();
        this.files = this.filecache.getAll();
        if (typeof this.files !== 'undefined' && this.files.length > 0) {
            for (const file of this.files) {
                this.api.load(file.content);
            }
        }

        this.calcCategories();
    }

    ionViewWillLeave() {
       this.saveCategories();
    }

    ngOnInit() {
        this.querySubscription = this.route.queryParams.subscribe((params) => {
           if (params.load) {
               this.download(params.load);
           }
        });
    }

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }

    private calcCategories() {
        this.incomeSum = 0;
        this.outcomeSum = 0;
        this.categories.forEach((elem) => {
            elem.sum = 0;
            elem.entries = [];
        });

        const accounts = this.api.accounts;
        this.currency = accounts.length > 0 ? accounts[0].currency : 'EUR';

        for (const entry of this.api.entries) {
            const checkEntry = entry as CheckEntry;
            checkEntry.found = [];
            this.checkCategories(checkEntry);
            this.checkIncomeOutcome(checkEntry);
        }
        console.log(this.categories);
    }

    saveCategories() {
        this.categories.forEach((elem) => {
            elem.sum = 0;
            elem.entries = [];
        });

        localStorage.setItem('userCategories', JSON.stringify(this.categories));
        this.calcCategories();
    }

    checkCategories(entry: CheckEntry) {
        for (const cat of this.categories) {
            const catname = cat.id;
            for (const check in cat) {
                if (check !== 'amount' && check !== 'title' && typeof entry[check] !== 'undefined') {
                    for (const test of cat[check]) {
                        if (!entry.found.includes(catname) && entry[check].toString().toLowerCase().includes(test.toLowerCase())) {

                            if (entry.creditordebit === 'CRDT') {
                                cat.sum += entry.amount;
                            } else if (entry.creditordebit === 'DBIT') {
                                cat.sum -= entry.amount;
                            }
                            cat.entries.push(entry);
                            entry.found.push(catname);
                        }
                    }
                }
            }
        }
    }

    checkIncomeOutcome(entry: PEntry) {
        if (entry.creditordebit === 'CRDT') {
            this.incomeSum += entry.amount;
        } else if (entry.creditordebit === 'DBIT') {
            this.outcomeSum += entry.amount;
        }
    }

    add() {
        const cat = new Category();
        this.categories.push(cat);
        this.edit(cat);
    }

    remove(index: number) {
        this.categories.splice(index, 1);
    }

    async details(category: Category) {
        const modal = await this.modalCtrl.create({
            component: DetailCategoryPage,
            swipeToClose: true,
            componentProps: {
                category
            }
        });
        modal.present();
    }

    async edit(category: Category) {
        this.list.closeSlidingItems();
        const modal = await this.modalCtrl.create({
            component: EditCategoryPage,
            swipeToClose: true,
            componentProps: {
                category
            }
        });
        modal.onDidDismiss().then((value) => {
            this.calcCategories();
        });
        modal.present();
    }

    async openDownload() {
        const alert = await this.alertCtrl.create({
            header: 'Einen Topf laden',
            inputs: [
              {
                name: 'id',
                type: 'text',
                placeholder: 'ID des Topfes'
              }
            ],
            buttons: [
              {
                text: 'Abbrechen',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {

                }
              }, {
                text: 'Ok',
                handler: (data) => {
                  this.download(data.id);
                }
              }
            ]
          });

        await alert.present();
    }

    private download(id: string) {
        this.storage.getFromStorage(id).then(async (data) => {
            this.categories.push(data);

            const toast = await this.toastCtrl.create({
                duration: 3000,
                message: `Topf mit der ID "${id}" hinzugefügt.`,
                color: 'primary'
              });
            toast.present();
        }).catch((e) => console.error(e));
    }
}
