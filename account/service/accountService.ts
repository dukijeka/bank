import {ObjectId} from "mongodb";
import Account from "../model/account";
import getMongoDbClient from "./getMongoClient";

const accoountsCollectionName = "accounts";
const bankDbName = "bank";

export class AccountService {
    static async createAccount(): Promise<Account> {
        const client = getMongoDbClient();
        const account: Account = {
            _id: ObjectId.createFromTime(Date.now()),
            wallets: []
        };

        try {
            await client.connect();

            await client.db(bankDbName).collection(accoountsCollectionName).insertOne(account);

            return account;

        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    }

    static async getByID(id: string): Promise<Account> {
        const client = getMongoDbClient();

        try {
            await client.connect();

            const account = await client.db(bankDbName).collection(accoountsCollectionName).findOne<Account>(new ObjectId(id));

            if (account === null) {
                throw new Error(`Account with id ${id} does not exist`);
            }

            return account;
        } finally {
            await client.close();
        }
    }

    static async addCurrency(accountId: string, currency: string): Promise<Account> {
        const client = getMongoDbClient();

        try {
            await client.connect();

            let account = null;
            try {
                account =
                    await client.db(bankDbName).collection(accoountsCollectionName).findOne<Account>(new ObjectId(accountId));
            } catch (e) {
                throw new Error(`Account with id ${accountId} does not exist`, {cause: {statusCode: 404}});
            }

            if (account === null) {
                throw new Error(`Account with id ${accountId} does not exist`, {cause: {statusCode: 404}});
            }

            if (!currency) {
                throw new Error(`Currency not provided`, {cause: {statusCode: 400}});
            }

            if (account.wallets.some(wallet => wallet.currency === currency)) {
                throw new Error(`Account already has currency ${currency}`, {cause: {statusCode: 409}});
            }

            await client.db(bankDbName).collection(accoountsCollectionName)
                .updateOne(account,
                    {"$set":
                            {wallets: [...account.wallets, {currency, balance: 0}]}
                    }, {upsert: false});

            account.wallets.push({currency, balance: 0});

            return account;
        } finally {
            await client.close();
        }
    }
}