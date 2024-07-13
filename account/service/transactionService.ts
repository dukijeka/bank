import {MongoClient, ObjectId} from "mongodb";
import Account from "../model/account";
import getMongoDbClient from "./dbClient/getMongoClient";
import {Transaction, TransactionType} from "../model/transaction";
import {Wallet} from "../model/wallet";
import {AccountService} from "./accountService";

const accoountsCollectionName = "accounts";
const bankDbName = "bank";

export class TransactionService {
    static async applyTransaction(accountId: string, transaction: Transaction): Promise<Account> {
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

            if (!transaction) {
                throw new Error(`Missing transaction`, {cause: {statusCode: 400}});
            }

            if (transaction.type === TransactionType.inbound) {
                account = await this.applyInboundTransaction(account, transaction, client);
            }

            if (transaction.type === TransactionType.outbound) {
                account = await this.applyOutboundTransaction(account, transaction, client);
            }
        } finally {
            await client.close();
        }

        return account;
    }

    public static async getTransactions(accountId: string): Promise<Transaction[]> {
        return (await AccountService.getAccountById(accountId)).transactions;
    }

    private static async applyInboundTransaction(account: Account, transaction: Transaction, client: MongoClient): Promise<Account> {
        const walletToUpdate =
            account.wallets.find(wallet => wallet.currency === transaction.currency);

        if (!walletToUpdate) {
            throw new Error(`No wallet with currency ${transaction.currency} found for account ${account._id}`,
                {cause: {statusCode: 404}}
            );
        }

        return await this.applyTransactionToWallet(account, transaction, walletToUpdate, client);
    }

    private static async applyOutboundTransaction(account: Account, transaction: Transaction, client: MongoClient): Promise<Account> {
        const walletToUpdate =
            account.wallets.find(wallet => wallet.currency === transaction.currency);

        if (!walletToUpdate) {
            throw new Error(`No wallet with currency ${transaction.currency} found for account ${account._id}`,
                {cause: {statusCode: 404}}
            );
        }

        if (walletToUpdate.balance - transaction.amount < 0) {
            throw new Error(`Not enough money in ${walletToUpdate.currency} wallet for account ${account._id}`,
                {cause: {statusCode: 400}}
            );
        }

        return await this.applyTransactionToWallet(account, transaction, walletToUpdate, client);
    }

    private static async applyTransactionToWallet(account: Account, transaction: Transaction, walletToUpdate: Wallet, client: MongoClient) {
        if (transaction.type === TransactionType.inbound) {
            walletToUpdate.balance += transaction.amount;
        }

        if (transaction.type === TransactionType.outbound) {
            walletToUpdate.balance -= transaction.amount;
        }

        const newWallets = account.wallets.filter(wallet => wallet.currency !== transaction.currency);

        newWallets.push(walletToUpdate);

        await client.db(bankDbName).collection(accoountsCollectionName)
            .findOneAndUpdate({_id: account._id},
                {
                    "$set":
                        {
                            wallets: newWallets,
                            transactions: [...account.transactions, transaction]
                        }
                }, {upsert: false});

        return {...account, wallets: newWallets, transactions: [...account.transactions, transaction]} as Account;
    }
}