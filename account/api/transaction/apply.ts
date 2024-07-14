import {Handler} from "aws-lambda";
import {TransactionService} from "../../service/transactionService";

export const handler: Handler = async (event) => {
    try {
        const accountId = event.pathParameters.accountId;
        const transaction = JSON.parse(event.body);
        
        const account =
            await TransactionService.applyTransaction(accountId, transaction);

        await TransactionService.publishTransactionEvent(accountId, transaction);

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