import {Handler} from "aws-lambda";
import {TransactionService} from "../../service/transactionService";

export const handler: Handler = async (event) => {
    try {
        const account =
            await TransactionService.applyTransaction(event.pathParameters.accountId, JSON.parse(event.body));

        return {
            statusCode: 200,
            body: JSON.stringify(account),
        };
    } catch (e: any) {
        return {
            statusCode: e?.cause?.statusCode ?? 500,
            body: JSON.stringify({error: e.message}),
        };
    }
};