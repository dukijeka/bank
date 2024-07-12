import { ObjectId } from "mongodb";
import { Wallet } from "./wallet";

interface Account {
    _id: ObjectId,
    supportedCurrencies: string[],
    wallets: Wallet[]
}

export default Account;