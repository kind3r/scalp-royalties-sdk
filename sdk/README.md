# Scalp Empire Royalties JavaScript SDK

## Install in your project

```bash
$ npm install @scalp/royalties
```
or
```bash
$ yarn add @scalp/royalties
```

## Basic usage

```typescript
import { ScalpRoyaltiesSDK } from "@scalp/royalties";

// Set your API key
ScalpRoyaltiesSDK.setApiKey("YOUR-API-KEY");

// Construct the list of mints
const mints = [
  "MINT_ADDRESS_1",
  "MINT_ADDRESS_2",
  "MINT_ADDRESS_3"
];

// Check the list of mints
const mintRoyalties = await ScalpRoyaltiesSDK.checkMints(mints);
if (typeof mintRoyalties !== "undefined") {
  for (const mint of mintRoyalties) {
    // Log status of each mint
    console.log(`${mint.mint} => ${mint.status}`);
  }
}
```
You can also set the API key via `REACT_APP_SR_APIKEY` or `NEXT_PUBLIC_SR_APIKEY` environment variables.  

