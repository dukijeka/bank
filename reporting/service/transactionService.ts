import {Transaction} from "../model/transaction";
import getMongoDbClient from "./dbClient/getMongoClient";
import {ObjectId} from "mongodb";

const accountsCollectionName = "reports";
const bankDbName = "bank";

export class TransactionService {
    static async storePublishedTransaction(transaction: Transaction): Promise<void> {
        const client = getMongoDbClient();

        try {
            await client.connect();

            transaction._id = ObjectId.createFromTime(Date.now());

            await client.db(bankDbName).collection(accountsCollectionName).insertOne(transaction);

        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    }

    static async getTransactionsForCurrentMonthForAccount(accountId: string): Promise<Transaction[]> {
        const client = getMongoDbClient();

        try {
            await client.connect();

            const boundsOfCurrentMonth = this.getcurrentMonthUtcMillisecondsBounds();
            return await client.db(bankDbName).collection(accountsCollectionName) // TODO filter for current month
                .find<Transaction>({}, {projection: {accountId: accountId}}).toArray();

        } catch
            (e) {
            throw e;
        } finally {
            await client.close();
        }
    }

    private static

    getcurrentMonthUtcMillisecondsBounds(): { begining: number, end: number } {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const beginningOfCurrentMonth = new Date(currentYear, currentMonth, 1).getUTCMilliseconds();

        let beginningOfNextMonth: number;

        if (currentMonth === 11) {
            beginningOfNextMonth = new Date(currentYear + 1, 0, 1).getUTCMilliseconds();
        } else {
            beginningOfNextMonth = new Date(currentYear, currentMonth + 1, 1).getUTCMilliseconds();
        }

        return {begining: beginningOfCurrentMonth, end: beginningOfNextMonth - 1};
    }
}