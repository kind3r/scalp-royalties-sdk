# Scalp Empire Royalties API SDK

[Scalp Empire](https://www.scalp-empire.com) offers an easy way for creators and project owners to check the status of royalty payments for the NFTs part of their collection.  
Access is provided **free of charge** within certain usage limits.

The API also offers an easy way for developers to integrate royalty payments into their dAPP by generating and submiting the royalty payment transaction.

If you are a creator or project owner and would like access to this API please contact us on our [Discord](https://www.discord.gg/scalpempire) in order to obtain your API KEY.


## Work in progress

TODO:  
[ ] Expand documentation  
[x] [JavaScript/TypeScript API SDK package](sdk/README.md)  
[ ] React component  

## Sample workflow

Please see [docs/api.yaml](docs/api.yaml) for the OpenApi specifications.  

1. Fetch information about what NFTs part of your collection the user holds
2. Use the `GET /check/{mint}` or `POST /check` endpoints to retrive NFT and royalty status
3. Prompt the user to choose which NFT(s) he wants to pay royalties for and the amount (Full, Half, custom)
4. Call `POST /pay-transaction` endpoint with required paramters to build the royalty payment transaction
5. Prompt the user to accept and sign the transaction
6. Call `POST /pay-submit` with the signed transaction and wait for confirmation

