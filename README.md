# Scalp Empire Royalties API SDK

[Scalp Empire](https://www.scalp-empire.com) offers an easy way for creators and project owners to check the status of royalty payments for the NFTs part of their collection.  
Access is provided **free of charge** within certain usage limits.

The API also offers an easy way for developers to integrate royalty payments into their dAPP by generating and submiting the royalty payment transaction.

If you are a creator or project owner and would like access to this API please contact us on our [Discord](https://www.discord.gg/uBVgnSWydc) in order to obtain your API KEY.


## Resources

* [OpenApi specifications](docs/api.yaml)   
* [JavaScript/TypeScript API SDK package](sdk/)  
* [Sample Next.js React app](examples/simple-app-next/)  
* [Sample CLI for overriding royalties](examples/override-cli)  


## Sample workflow

Please see [docs/api.yaml](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/kind3r/scalp-royalties-sdk/main/docs/api.yaml) for the OpenApi specifications.  

1. Fetch information about what NFTs part of your collection the user holds
2. Use the `GET /check/{mint}` or `POST /check` endpoints to retrieve NFT and royalty status
3. Prompt the user to choose which NFT(s) he wants to pay royalties for and the amount (Full, Half, custom)
4. Call `POST /pay-transaction` endpoint with required parameters to build the royalty payment transaction
5. Prompt the user to accept and sign the transaction
6. Call `POST /pay-submit` with the signed transaction and wait for confirmation

## Overriding sale royalties

You can use the `POST /pay-override` endpoint to change the royalties payment status of the last sale of an NFT in case the system did not correctly detect that the royalties were paid.

> Please note that this call **should not be used in a frontend** as it requires an additional secret key that is passed in the `payer` parameter. Anyone holding your API key and secret key could mark sales as paid when in fact they are not.

1. Use the `GET /check/{mint}` or `POST /check` endpoints to retrieve NFT and royalty status
2. Call `POST /pay-override` endpoint with required parameters to mark the sale transaction as paid

## Changelog

### `1.1.2` 2023-12-12
 - Add transaction royalties override endpoint
### `1.1.1` 2023-03-03
 - Add sale proof of royalty payment (transaction) if it was done via this API
 - Endpoint to get last royalty payments
### `1.1.0` 2023-03-03
 - Add collection and mint information
### `1.0.0` - 2023-02-27
 - Initial SDK and sample app release