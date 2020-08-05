import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PecuniAPI, PecuniatorEntry } from '@merzlabs/pecuniator-api';
import { ModalController, IonList, AlertController, ToastController } from '@ionic/angular';

import { EditCategoryPage } from '../edit-category/edit-category.page';
import { Category } from '../types/Category';
import { DetailCategoryPage } from '../detail-category/detail-category.page';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { StorageService } from '../services/storage.service';
import { Month } from '../types/Month';
import { SavingsComponent } from '../components/savings/savings.component';
import { CheckEntry, CategoryService } from '../services/category.service';
import { UserConfig } from '../types/UserConfig';
import { ConfigsharePage } from '../configshare/configshare.page';
import { BankingService } from '../services/banking.service';

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
    incomeEntries: Array<PecuniatorEntry>;
    outcomeEntries: Array<PecuniatorEntry>;
    savings: Array<PecuniatorEntry>;
    months: Array<Month>;
    month: Month;
    results: PecuniatorEntry[];
    ignoredIBANs: string[];
    ignoredCreditor: string[];
    ignoredDebtor: string[];
    unassinged: PecuniatorEntry[];

    constructor(private filecache: FileCacheService, private modalCtrl: ModalController, private alertCtrl: AlertController,
                private storage: StorageService, private toastCtrl: ToastController, private route: ActivatedRoute,
                private category: CategoryService, private banking: BankingService) {
        this.api = new PecuniAPI();

        this.init();
    }

    private init() {
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
        this.loadIgnored();
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
        let sum = 0.0;
        if (!this.savings || this.savings.length === 0) {
            return sum;
        }
        // savings are not only transferred into savings account but also out so calculate that
        this.savings.forEach((entry) => {
            if (this.isDebt(entry)) {
                sum += entry.amount;
            } else {
                sum -= entry.amount;
            }
        });
        return sum;
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

        const data = this.banking.getData();
        console.log('Banking data', data);
        if (data) {
            this.api.load(data);
        }

        this.loadIgnored();
        this.calcCategories();
    }

    loadIgnored() {
        this.ignoredIBANs = localStorage.getItem(SavingsComponent.IGNOREIBAN)?.split(',');
        this.ignoredCreditor = localStorage.getItem(SavingsComponent.IGNORECREDITOR)?.split(',');
        this.ignoredDebtor = localStorage.getItem(SavingsComponent.IGNOREDEBTOR)?.split(',');
    }

    ionViewWillLeave() {
        this.saveCategories();
    }

    ngOnInit() {
        this.querySubscription = this.route.queryParams.subscribe((params) => {
            if (params.config) {
                this.storage.login().then(() => {
                    this.loadConfig(params.config);
                });
            }

            if (params.load) {
                this.downloadCategory(params.load);
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
                const returnValue = this.appendIncomeOutcomeEntries(checkEntry);
                this.addTransactionToMonth(entry);
            }

        }
        console.log(this.categories);
        this.unassinged = entries.filter((elem) => !this.checkIgnored(elem) && elem.found?.length < 1);
    }

    private addTransactionToMonth(entry: PecuniatorEntry) {
        const isDebit = this.isDebt(entry);
        const yearAndMonth = entry.bookingDate.substring(0, 7);
        const month: Month | null = this.months.find((elem) => elem.date === yearAndMonth);

        if (!this.checkIgnored(entry)) {
            if (month) {
                month.entries.push(entry);
                if (isDebit) {
                    month.expenseSum += entry.amount;
                } else {
                    month.incomeSum += entry.amount;
                }
            } else {
                const date = new Date(entry.bookingDate);
                const newMonth: Month = {
                    label: `${date.getMonth() > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getFullYear()}`,
                    date: yearAndMonth,
                    expenseSum: 0.0,
                    incomeSum: 0.0,
                    entries: [entry]
                };
                if (isDebit) {
                    newMonth.expenseSum += entry.amount;
                } else {
                    newMonth.incomeSum += entry.amount;
                }
                this.months.push(newMonth);
            }
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

    filterEntries(entries: Array<PecuniatorEntry>) {
        this.calcCategories(entries);
        this.results = entries;
    }

    /**
     * Check creditordebit
     * @return true if appended to outcome, false if appended to income and null if was ignored by exclusion filters
     */
    appendIncomeOutcomeEntries(entry: PecuniatorEntry) {
        if (!this.checkIgnored(entry)) {
            if (entry.creditordebit === 'CRDT') {
                if (!this.incomeEntries.includes(entry)) {
                    this.incomeEntries.push(entry);
                }
                return false;
            } else if (entry.creditordebit === 'DBIT') {
                if (this.checkIgnored(entry)) {
                    return false;
                }

                // TODO is this check necessary or a workaround which should be removed
                // my testing showed to include it
                if (!this.outcomeEntries.includes(entry)) {
                    this.outcomeEntries.push(entry);
                }
                return true;
            }
        }
        // TODO good idea or nah?
        return null;
    }


    /**
     * Checks if an entry is debit or credit
     * Should be replaced by clearer typed pecuniator method/attribute
     * @param entry Pecuniator Entry
     */
    isDebt(entry: PecuniatorEntry): boolean | null {
        let isDebit = null;
        // TODO smarter way for pecuniator to strongly type tell if credit or debit transaction
        if (entry.creditordebit === 'CRDT') {
            isDebit = false;
        } else if (entry.creditordebit === 'DBIT') {
            isDebit = true;
        }
        return isDebit;
    }

    /**
     * Check if entry should be ignored because of user settings
     * @return true if invalid
     */
    checkIgnored(entry: PecuniatorEntry): boolean {
        let invalid = false;
        const isDebit = this.isDebt(entry);

        if (this.ignoredIBANs?.length > 0) {
            invalid = isDebit ? this.ignoredIBANs.includes(entry.creditorIBAN) : this.ignoredIBANs.includes(entry.debitorIBAN);
        }

        if (!invalid && this.ignoredCreditor?.length > 0) {
            let i = 0;
            let account = this.ignoredCreditor[i];
            while (account && !invalid) {
                invalid = isDebit ?
                        entry.creditorName?.toLowerCase().includes(account.toLowerCase()) :
                        entry.debtorName?.toLowerCase().includes(account.toLowerCase());

                account = this.ignoredCreditor[++i];
            }
        }

        if (!invalid && this.ignoredDebtor?.length > 0) {
            let i = 0;
            let account = this.ignoredDebtor[i];
            while (account && !invalid) {
                invalid = isDebit ?
                        entry.creditorName?.toLowerCase().includes(account.toLowerCase()) :
                        entry.debtorName?.toLowerCase().includes(account.toLowerCase());

                account = this.ignoredDebtor[++i];
            }
        }

        if (invalid && !this.savings.includes(entry)) {
            // TODO cannot overwrite what kind of transaction to display as +/- in list of entries for saving part
            // every transactions to saving is listed as losing money and getting back as income which is wrong
            // const assignValue = this.isDebt(entry) ? 'CRDT' : 'DBIT';
            // const retyped = entry as SavingTransaction;
            // retyped.creditordebit = assignValue;

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
        this.saveCategories();
    }

    remove(index: number) {
        this.categories.splice(index, 1);
        this.saveCategories();
        this.calcCategories();
    }

    async details(p: Category | Array<PecuniatorEntry>) {
        let entries: Array<PecuniatorEntry> = [];
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
                        this.downloadCategory(data.id);
                    }
                }
            ]
        });

        await alert.present();
    }

    private downloadCategory(id: string) {
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

    async storeConfig() {
        const alert = await this.alertCtrl.create({
            header: 'Konfiguration hochladen',
            // tslint:disable-next-line: max-line-length
            message: 'Sie könne alle ihre Einstellungen (natürlich ohne Finanzdaten) anonym speichern um sie auf einem anderen Gerät wieder herunterzuladen.',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {

                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.uploadConfig();
                    }
                }
            ]
        });

        await alert.present();
    }

    private loadConfig(id: string) {
        this.storage.getConfig(id).then(async (data) => {
            for (const prop in data) {
                if (typeof data[prop] === 'string' || typeof data[prop] === 'boolean') {
                    localStorage.setItem(prop, data[prop]);
                }
            }
            this.init();
            this.calcCategories();

            const toast = await this.toastCtrl.create({
                duration: 5000,
                message: `Konfiguration geladen`,
                color: 'primary'
            });
            toast.present();
        }).catch((e) => console.error(e));
    }

    private async uploadConfig() {
        const config = new UserConfig();
        const id = await this.storage.storeConfig(config);

        const modal = await this.modalCtrl.create({
            component: ConfigsharePage,
            swipeToClose: true,
            componentProps: {
                id
            }
        });
        modal.present();
    }
}
