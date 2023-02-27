This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Install dependencies

```bash
$ npm install
```
or
```bash
$ yarn
```

2. Setup environment  
In the root of the project, create a file named `.env.local` containing the following data:
```
NEXT_PUBLIC_SR_APIKEY=YOUR_API_KEY
NEXT_PUBLIC_SOLANA_RPC=YOUR_RPC_SERVER
```

3. run the development server:

```bash
$ npm run dev
# or
$ yarn dev
# or
$ pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Exploring the example

Start by looking at the single page [src/pages/index.tsx](src/pages/index.tsx) source code that contains all the documented calls.
1. Wait for user to connect wallet
2. Refresh the list of held NFTs by using `getParsedTokenAccountsByOwner` Solana API: [refreshAssets](src/pages/index.tsx#L28)
3. Use the royalties API to check the list of held NFTs: [checkHoldings](src/pages/index.tsx#L38)
4. Show the status of each recognized NFT and offer the possibility to pay the overdue royalties: [payRoyalties](src/pages/index.tsx#L61)