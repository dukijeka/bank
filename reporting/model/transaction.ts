import {ObjectId} from "mongodb";

export enum TransactionType {
    inbound = 'INBOUND',
    outbound = 'OUTBOUND'
}

export interface Transaction {
    _id: ObjectId,
    accountId: string,
    type: TransactionType;
    currency: string;
    amount: number;
}