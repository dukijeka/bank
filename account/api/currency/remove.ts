import {Handler} from "aws-lambda";
import {WalletService} from "../../service/walletService";

export const handler: Handler = async (event) => {
    try {
        await WalletService.removeCurrency(event.pathParameters.accountId, event.pathParameters.currencyName);

        return {
            statusCode: 204,
        };
    } catch (e: any) {
        return {
            statusCode: e?.cause?.statusCode ?? 500,
            body: JSON.stringify({error: e.message}),
        };
    }
};