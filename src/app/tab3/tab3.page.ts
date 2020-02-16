import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FileCacheService, CachedFile } from '../services/file-cache.service';
import { PecuniAPI, PEntry } from '@merzlabs/pecuniator-api';

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
    message = '';
    incomeSum: number;
    outcomeSum: number;

    constructor(private filecache: FileCacheService) {
        this.api = new PecuniAPI();
    }

    ionViewWillEnter() {
        // Reset api instance of this page from files in cache every time
        this.api.clear();
        this.incomeSum = 0;
        this.outcomeSum = 0;
        this.files = this.filecache.getAll();
        if (typeof this.files !== 'undefined' && this.files.length > 0) {
            for (const file of this.files) {
                this.api.load(file.content);
            }
        }

        const categories = {
            saving: {
                remittanceInformation: ['DEPOT'],
                amount: 0,
                title: 'Savings'
            },
            fuel: {
                creditorName: ['Tank'],
                amount: 0,
                title: 'Tank'
            },
            insu: {
                remittanceInformation: ['Versicherung'],
                amount: 0,
                title: 'Insurance'
            },
            online: {
                creditorName: ['Paypal'],
                amount: 0,
                title: 'Online'
            },
            cell: {
                creditorName: ['Drillisch', 'Telekom'],
                amount: 0,
                title: 'Cellphone'
            },
        };
        for (const entry of this.api.entries) {
            const checkEntry = entry as CheckEntry;
            checkEntry.found = [];
            this.checkCategories(checkEntry, categories);
            this.checkIncomeOutcome(checkEntry);
        }

        console.debug(categories);
        for (const name in categories) {
            if (categories.hasOwnProperty(name)) {
                const cat = categories[name];
                this.message += `|| ${cat.title} - ${cat.amount}€ ||`;
            }
        }
    }

    checkCategories(entry: CheckEntry, categories) {
        for (const catname in categories) {
            if (categories.hasOwnProperty(catname)) {
                const cat = categories[catname];
                for (const check in cat) {
                    if (check !== 'amount' && check !== 'title' && typeof entry[check] !== 'undefined') {
                        for (const test of cat[check]) {
                            if (!entry.found.includes(catname) && entry[check].toString().toLowerCase().includes(test.toLowerCase())) {
                                cat.amount += entry.amount;
                                entry.found.push(catname);
                            }
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
}
