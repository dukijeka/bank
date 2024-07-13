import {ObjectId} from "mongodb";
import { Wallet } from "./wallet";
import {Transaction} from "./transaction";

interface Account {
    _id: ObjectId,
    wallets: Wallet[],
    transactions: Transaction[],
}

export default Account;