/**
 * Query object for entries with some fields for categories. Always tests objects properties with include.
 */
export class Category {
    remittanceInformation?: Array<string>;
    creditorName?: Array<string>;
    sum: number;
    title: string;
    id: string;
}