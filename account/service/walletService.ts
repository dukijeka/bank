import {MongoClient, ObjectId} from "mongodb";
import Account from "../model/account";
import getMongoDbClient from "./dbClient/getMongoClient";

const accoountsCollectionName = "accounts";
const bankDbName = "bank";

export class WalletService {
    static async addCurrency(accountId: string, currency: string): Promise<Account> {
        const client = getMongoDbClient();
        let account = null;

        try {
            await client.connect();

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
                .findOneAndUpdate({_id: account._id},
                    {
                        "$set":
                            {wallets: [...account.wallets, {currency, balance: 0}]}
                    }, {upsert: false});

            account.wallets.push({currency, balance: 0});

        } finally {
            await client.close();
        }

        return account;
    }

    static async removeCurrency(accountId: string, currency: string): Promise<void> {
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

            if (account.wallets.every(wallet => wallet.currency !== currency)) {
                throw new Error(`No wallet with currency ${currency} found for account ${accountId}`,
                    {cause: {statusCode: 404}}
                );
            }

            const filteredWallets = account.wallets.filter(wallet => wallet.currency !== currency);

            await client.db(bankDbName).collection(accoountsCollectionName)
                .findOneAndUpdate({_id: account._id},
                    {
                        "$set":
                            {wallets: filteredWallets}
                    }, {upsert: false});
        } finally {
            await client.close();
        }
    }
}