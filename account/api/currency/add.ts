import {Handler} from "aws-lambda";
import {WalletService} from "../../service/walletService";

export const handler: Handler = async (event) => {
    try {
        const account =
            await WalletService.addCurrency(event.pathParameters.accountId, event.pathParameters.currencyName);

        return {
            statusCode: 201,
            body: JSON.stringify(account),
        };
    } catch (e: any) {
        return {
            statusCode: e?.cause?.statusCode ?? 500,
            body: JSON.stringify({error: e.message}),
        };
    }
};