import { PEntry } from '@merzlabs/pecuniator-api';

export interface Expense {
    label: string;
    amount: number;
    entries: Array<PEntry>;
}
