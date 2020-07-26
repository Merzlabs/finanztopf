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
import { Expense } from '../types/Expense';
import { SavingsComponent } from '../components/savings/savings.component';
import { CheckEntry, CategoryService } from '../services/category.service';

class Month implements Expense {
    label: string;
    date: string;
    entries: Array<PEntry>;
    amount: number;
}

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
    private files: CachedFile[];
    api: PecuniAPI;
    categories: Array<Category>;
    @ViewChild('categorylist') list: IonList;
    querySubscription: Subscription;
    currency: string;
    incomeEntries: Array<PEntry>;
    outcomeEntries: Array<PEntry>;
    savings: Array<PEntry>;
    months: Array<Month>;
    month: Month;
    results: PEntry[];
    ignoredIBANs: string[];
    ignoredCreditors: string[];
    unassinged: PEntry[];

    constructor(private filecache: FileCacheService, private modalCtrl: ModalController, private alertCtrl: AlertController,
                private storage: StorageService, private toastCtrl: ToastController, private route: ActivatedRoute,
                private category: CategoryService) {
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

    get incomeSum(): number {
        if (!this.incomeEntries || this.incomeEntries.length === 0) {
            return 0.0;
        }
        return this.incomeEntries.map(item => item.amount).reduce((prev, next) => prev + next);
    }

    get outcomeSum(): number {
        if (!this.outcomeEntries || this.outcomeEntries.length === 0) {
            return 0.0;
        }
        return this.outcomeEntries.map(item => item.amount).reduce((prev, next) => prev + next);
    }

    get savingsSum(): number {
        if (!this.savings || this.savings.length === 0) {
            return 0.0;
        }
        return this.savings.map(item => item.amount).reduce((prev, next) => prev + next);
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

        this.loadIgnored();
        this.calcCategories();
    }

    loadIgnored() {
        this.ignoredIBANs = localStorage.getItem(SavingsComponent.IGNOREIBAN)?.split(',');
        this.ignoredCreditors = localStorage.getItem(SavingsComponent.IGNORECREDITOR)?.split(',');
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

    private calcCategories(entries?: Array<CheckEntry>) {
        let clearCache = false;
        if (!entries) {
            clearCache = true;
            entries = this.api.entries as CheckEntry[];
        }

        if (clearCache) {
            this.incomeEntries = [];
            this.outcomeEntries = [];
            this.months = [];
            this.savings = [];
        }

        // Reset sums on categories
        this.categories.forEach((elem) => {
            elem.sum = 0;
            elem.entries = [];
        });

        const accounts = this.api.accounts;
        this.currency = accounts.length > 0 ? accounts[0].currency : 'EUR';

        for (const entry of entries) {
            const checkEntry = entry;
            checkEntry.found = [];
            this.category.checkCategories(checkEntry, this.categories);

            if (clearCache) {
                const isExpense = this.checkIncomeOutcome(checkEntry);
                if (isExpense) {
                    this.addExpense(entry);
                }
            }

        }
        console.log(this.categories);
        this.unassinged = entries.filter((elem) => elem.found?.length < 1);
    }

    private addExpense(entry: PEntry) {
        const yearAndMonth = entry.bookingDate.substring(0, 7);
        const month = this.months.find((elem) => elem.date === yearAndMonth);
        if (month) {
            month.entries.push(entry);
            month.amount += entry.amount;
        } else {
            const date = new Date(entry.bookingDate);
            this.months.push({
                label: `${date.getMonth() > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getFullYear()}`,
                date: yearAndMonth,
                entries: [entry],
                amount: entry.amount
            });
        }
    }

    saveCategories() {
        this.categories.forEach((elem) => {
            elem.sum = 0;
            elem.entries = [];
        });

        localStorage.setItem('userCategories', JSON.stringify(this.categories));
        this.calcCategories();
    }

    filterEntries(entries: Array<PEntry>) {
        this.calcCategories(entries);
        this.results = entries;
    }

    /**
     * Check creditordebit
     * @return true if outcome
     */
    checkIncomeOutcome(entry: PEntry) {
        if (entry.creditordebit === 'CRDT') {
            this.incomeEntries.push(entry);
            return false;
        } else if (entry.creditordebit === 'DBIT') {
            if (this.checkIgnored(entry)) {
                return false;
            }

            this.outcomeEntries.push(entry);
            return true;
        }
    }

    checkIgnored(entry: PEntry): boolean {
        let invalid = false;
        if (this.ignoredIBANs?.length > 0) {
            invalid = this.ignoredIBANs.includes(entry.creditorIBAN);
        }

        if (!invalid && this.ignoredCreditors?.length > 0) {
            let i = 0;
            let cred = this.ignoredCreditors[i];
            while (cred && !invalid) {
                invalid = entry.creditorName.toLowerCase().includes(cred.toLowerCase());
                cred = this.ignoredCreditors[++i];
            }
        }

        if (invalid) {
            this.savings.push(entry);
        }

        return invalid;
    }

    addCategories(categories: Category[]) {
        categories.forEach((elem) => elem.sum = 0);
        this.categories = this.categories.concat(categories);
        this.saveCategories();
        this.calcCategories();
    }

    add(cat?: Category) {
        if (!cat) {
            cat = new Category();
        }
        this.categories.push(cat);
        this.edit(cat);
    }

    remove(index: number) {
        this.categories.splice(index, 1);
    }

    async details(p: Category | Array<PEntry>) {
        let entries: Array<PEntry> = [];
        if (p instanceof Array) {
            entries = p;
        } else {
            entries = p.entries;
        }

        const modal = await this.modalCtrl.create({
            component: DetailCategoryPage,
            swipeToClose: true,
            componentProps: {
                entries
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
            this.saveCategories();
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
