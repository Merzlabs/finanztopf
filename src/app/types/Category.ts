import { PecuniatorEntry } from '@merzlabs/pecuniator-api';

/**
 * Query object for entries with some fields for categories. Always tests objects properties with include.
 */
export class Category {
    remittanceInformation?: Array<string>;
    creditorName?: Array<string>;
    debtorName?: Array<string>;
    sum: number;
    title: string;
    id: string;
    entries?: Array<PecuniatorEntry>;
    owner?: string;
    active?: boolean;
    isIgnored?: boolean;

    constructor() {
        this.id = Date.now().toString(); // TODO better idgen
        this.sum = 0;
        this.entries = [];
    }
}
