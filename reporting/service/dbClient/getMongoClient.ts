import {MongoClient, ServerApiVersion} from 'mongodb';

const uri = process.env.MONGODB_CONNECTION_STRING;

export default function getMongoDbClient() {
    if (uri === undefined) {
        throw new Error('MongoDb connection string is undefined');
    }

    return new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
}