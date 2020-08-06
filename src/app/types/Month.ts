import { PecuniatorEntry } from '@merzlabs/pecuniator-api';

export interface Month {
    label: string;
    date: string;
    expenseSum: number;
    incomeSum: number;
    entries: Array<PecuniatorEntry>;
}
