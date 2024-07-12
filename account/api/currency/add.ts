import {Handler} from "aws-lambda";
import {AccountService} from "../../service/accountService";

export const handler: Handler = async (event) => {
    try {
        const account =
            await AccountService.addCurrency(event.pathParameters.id, event.body ? JSON.parse(event.body)?.currency : undefined);

        return {
            statusCode: 201,
            body: JSON.stringify(account),
        };
    } catch (e: any) {
        return {
            statusCode: e.cause.statusCode,
            body: JSON.stringify({error: e.message}),
        };
    }
};