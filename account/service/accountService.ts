import {MongoClient, ObjectId} from "mongodb";
import Account from "../model/account";
import getMongoDbClient from "./dbClient/getMongoClient";

const accoountsCollectionName = "accounts";
const bankDbName = "bank";

export class AccountService {
    static async createAccount(): Promise<Account> {
        const client = getMongoDbClient();
        const account: Account = {
            _id: ObjectId.createFromTime(Date.now()),
            transactions: [],
            wallets: []
        };

        try {
            await client.connect();

            await client.db(bankDbName).collection(accoountsCollectionName).insertOne(account);

        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }

        return account;
    }

    static async getAccountById(id: string): Promise<Account> {
        const client = getMongoDbClient();

        let account;
        try {
            await client.connect();

            account = await client.db(bankDbName).collection(accoountsCollectionName).findOne<Account>(new ObjectId(id));

            if (account === null) {
                throw new Error(`Account with id ${id} does not exist`);
            }

        } finally {
            await client.close();
        }

        return account;
    }
}