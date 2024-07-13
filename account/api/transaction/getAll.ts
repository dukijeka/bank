import {Handler} from "aws-lambda";
import {TransactionService} from "../../service/transactionService";

export const handler: Handler = async (event) => {
    try {
        const transaction =
            await TransactionService.getTransactions(event.pathParameters.accountId);

        return {
            statusCode: 200,
            body: JSON.stringify(transaction),
        };
    } catch (e: any) {
        return {
            statusCode: e?.cause?.statusCode ?? 500,
            body: JSON.stringify({error: e.message}),
        };
    }
};