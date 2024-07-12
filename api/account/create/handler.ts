import {ScheduledEvent} from "aws-lambda";
import Account from "../../../model/account";
import getMongoDbClient from "../../getMongoClient";
import {ObjectId} from "mongodb";

exports.create = async (event: ScheduledEvent) => {
  const client = getMongoDbClient();
  const account: Account = {
    _id: ObjectId.createFromTime(Date.now()),
    currencies: []
  };

  try {
    await client.connect();

    await client.db('bank').collection('accounts').insertOne(account);

  } finally {
    await client.close();
  }

  return {
    statusCode: 201,
    body: JSON.stringify(account),
  };
};
