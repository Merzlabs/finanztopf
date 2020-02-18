import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { PecuniAPI, PEntry } from '@merzlabs/pecuniator-api';
import { ModalController, IonList } from '@ionic/angular';
import { EditCategoryPage } from '../edit-category/edit-category.page';
import { Category } from '../types/Category';

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
export class Tab3Page {
    private files: CachedFile[];
    api: PecuniAPI;
    incomeSum: number;
    outcomeSum: number;
    categories: Array<Category>;
    @ViewChild('categorylist') list: IonList;

    constructor(private filecache: FileCacheService, private modalCtrl: ModalController) {
        this.api = new PecuniAPI();

        this.categories = [
            {
                remittanceInformation: ['DEPOT'],
                sum: 0,
                title: 'Sparen',
                id: 'saving',
                entries: [],
            },
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

    private calcCategories() {
        this.incomeSum = 0;
        this.outcomeSum = 0;
        this.categories.forEach((elem) => {
            elem.sum = 0;
            elem.entries = [];
        });

        for (const entry of this.api.entries) {
            const checkEntry = entry as CheckEntry;
            checkEntry.found = [];
            this.checkCategories(checkEntry);
            this.checkIncomeOutcome(checkEntry);
        }
        console.debug(this.categories);
        console.debug(this.api.entries);
    }

    checkCategories(entry: CheckEntry) {
        for (const cat of this.categories) {
            const catname = cat.id;
            for (const check in cat) {
                if (check !== 'amount' && check !== 'title' && typeof entry[check] !== 'undefined') {
                    for (const test of cat[check]) {
                        if (!entry.found.includes(catname) && entry[check].toString().toLowerCase().includes(test.toLowerCase())) {
                            cat.sum += entry.amount;
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

    details(cat: Category) {
        console.debug(cat.entries);
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
            console.debug(value);
            this.calcCategories();
        });
        modal.present();
    }
}
