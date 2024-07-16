# Installing tools

Install node and serverless framework.

# MongoDB

Create account on https://cloud.mongodb.com/, with database named 'bank' and 2 collections named 'accounts' and 'reports'

Add environment variable MONGODB_CONNECTION_STRING = mongodb+srv://<_USRERNAME>:<_PASSWORD>@cluster0.wk0asdl.mongodb.net/?retryWrites=true&w=majority&appName=<APP_NAME> to your local env and lambdas on aws.

# dev env and deployment

To run the app in the dev mode go to /account or /reporting folder and run sls dev

To deploy the app, run sls deploy from /account or /reporting folders

# API

## Accounts service

### POST - https://g433ykm5fa.execute-api.us-east-1.amazonaws.com/accounts
Creates a new account. Returns an account.
#### Response format: 
<pre>{
    "_id":"b35d9a880000000000000000",
    "transactions":[],
    "wallets":[]
}</pre>
#### Response error codes
- 500 in case of any failure
### GET - https://g433ykm5fa.execute-api.us-east-1.amazonaws.com/accounts/{accountId}
Returns an account with `_id = accountID`
#### Response format:
<pre>{
    "_id":"b35d9a880000000000000000",
    "transactions":[],
    "wallets":[]
}</pre>
#### Response error codes
- 404 in case the account with `accountId` hasn't been found
### POST - https://g433ykm5fa.execute-api.us-east-1.amazonaws.com/accounts/{accountId}/currencies/{currencyName}
Create a wallet with the new currency. Returns an account.
#### Response error codes:
- 404 if account with `accountId` hasn't been found
- 409 if the account already has `currency` provided
- 500 in case of an unhandled exception
### DELETE - https://g433ykm5fa.execute-api.us-east-1.amazonaws.com/accounts/{accountId}/currencies/{currencyName}
Removes wallet with currency `currencyName`
- 404 if account with `accountId` hasn't been found, or if the account doesn't have the currency that needs to be deleted
- 500 in case of an unhandled exception
### POST - https://g433ykm5fa.execute-api.us-east-1.amazonaws.com/accounts/{accountId}/transactions
Creates the new translation.
Request format:
<pre>
{
    "type": "INBOUND",
    "currency": "usd",
    "amount": 10
}
</pre>

#### Response format:
<pre>
{
"_id":"adb4097d0000000000000000",
"transactions":[
    {"type":"INBOUND","currency":"usd","amount":100},
    {"type":"INBOUND","currency":"usd","amount":10},    
    {"type":"OUTBOUND","currency":"usd","amount":10},
    {"type":"OUTBOUND","currency":"usd","amount":10},
],
"wallets":[{"currency":"usd","balance":90}]}
</pre>
#### Response error codes
- 404 if account with `accountId` hasn't been found, or if the account doesn't have the currency that needs to be deleted
- 400 in case the request body is missing
- 500 if publishing event to `EventBridge` failed or in case of an unhandled exception
### GET - https://g433ykm5fa.execute-api.us-east-1.amazonaws.com/accounts/{accountId}/transactions
Returns list of transactions for account with `accountId`.
#### Response error codes
- 404 if account with `accountId` hasn't been found
## Accounts service

### onTransactionPublished
This function doesn't represent API endpoint, but it's triggered by Event bridge rule,
when apply transaction function sends the event to the event bus. 
It stores the transaction in `reports' collection.

### GET - https://9ado1ker52.execute-api.us-east-1.amazonaws.com/reports/{accountId}
Returns transactions from `reports` collection for the account with `accountId`,
for the current month. In real world application these would be transactions from the past, and not current month,
but I implemented it this way, so it's easier to test.

# Architecture

In this sample application, I've separated the code into `api`, `model` and `service` folders.

- `api` folder contains function code, separated by domain.
- `model` folder contains TS interfaces used by the code in `api` and `service` folders.
- `service` folder contains code that interacts with DB and application logic. 
In real-world application, it would be better to separate business logic, 
perhaps with clean architecture pattern. Currently, the method inside services are static, 
but with separated business logic, we could use dependency injection to make it more testable.

# Scalability and performance

Current schema in `reports` folder is not very efficient for high number of transactions in the collection.
We could organize them by account and/or month to optimize reading.