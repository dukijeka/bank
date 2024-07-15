import {EventBridgeEvent, Handler} from "aws-lambda";
import {Transaction} from "../model/transaction";
import {TransactionService} from "../service/transactionService";

export const handler: Handler<EventBridgeEvent<any, any>> = async (event: EventBridgeEvent<any, any>) => {
  try {
    const transaction: Transaction = event.detail.transaction;
    await TransactionService.storePublishedTransaction(transaction);

    return {
      statusCode: 200,
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: e.message}),
    };
  }
};
