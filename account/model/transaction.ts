export enum TransactionType {
    inbound = 'INBOUND',
    outbound = 'OUTBOUND'
}

export interface Transaction {
    type: TransactionType;
    currency: string;
    amount: number;
}