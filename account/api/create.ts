import {Handler} from "aws-lambda";
import {AccountService} from "../service/accountService";

export const handler: Handler = async (_) => {
  try {
    const account = await AccountService.createAccount();

    return {
      statusCode: 201,
      body: JSON.stringify(account),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: e.message}),
    };
  }


};
