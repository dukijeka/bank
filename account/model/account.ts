import { ObjectId } from "mongodb";
import { Wallet } from "./wallet";

interface Account {
    _id: ObjectId,
    wallets: Wallet[]
}

export default Account;