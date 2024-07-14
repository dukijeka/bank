import {Transaction} from "../model/transaction";
import getMongoDbClient from "./dbClient/getMongoClient";

const accoountsCollectionName = "reports";
const bankDbName = "bank";

export class TransactionService {
    static async storePublishedTransaction(transaction: Transaction): Promise<void> {
        const client = getMongoDbClient();

        try {
            await client.connect();

            await client.db(bankDbName).collection(accoountsCollectionName).insertOne(transaction);

        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    }
}