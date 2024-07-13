import { Handler } from "aws-lambda";
import {AccountService} from "../service/accountService";

export const handler: Handler = async (event) => {
  try {
    const account = await AccountService.getAccountById(event.pathParameters.accountId);
    return {
      statusCode: 200,
      body: JSON.stringify(account),
    };
  } catch (e: any) {
    return {
      statusCode: 404,
      body: JSON.stringify({error: e.message})
    }
  }
};
