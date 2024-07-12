import {ObjectId} from "mongodb";
import Account from "../model/account";
import getMongoDbClient from "./getMongoClient";

const collectionName = "accounts";
const dbName = "bank";

export class AccountService {
    static async createAccount(): Promise<Account> {
        const client = getMongoDbClient();
        const account: Account = {
            _id: ObjectId.createFromTime(Date.now()),
            supportedCurrencies: [],
            wallets: []
        };

        try {
            await client.connect();

            await client.db(dbName).collection(collectionName).insertOne(account);

            return account;

        } catch (e){
            throw e;
        } finally {
            await client.close();
        }
    }
    static async getByID(id: string): Promise<Account> {
        const client = getMongoDbClient();

        try {
            await client.connect();

            const account = await client.db(dbName).collection(collectionName).findOne<Account>(new ObjectId(id));

            if (account === null) {
                throw new Error(`Account with id ${id} does not exist`);
            }

            return account;
        } finally {
            await client.close();
        }
    }
}