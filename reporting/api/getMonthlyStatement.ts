import {Handler} from "aws-lambda";
import {TransactionService} from "../service/transactionService";

export const handler: Handler = async (event) => {
    try {
        const accountId = event.pathParameters.accountId;
        const transactions = await TransactionService.getTransactionsForCurrentMonthForAccount(accountId);

        return {
            statusCode: 200,
            body: JSON.stringify(transactions),
        };
    } catch (e: any) {
        return {
            statusCode: 404,
            body: JSON.stringify({error: e.message})
        }
    }
};