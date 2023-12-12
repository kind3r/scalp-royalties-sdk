Simple CLI to override royalties for specific mints.

## Getting Started

1. Install dependencies

```bash
$ npm install
```
or
```bash
$ yarn
```

2. Run the commands

Use `-h` to get a list of arguments:
```bash
$ npm start -- -h
```

You need to specify the API key `-a`, the secret key `-s` and a list of mints to mark as having royalties paid `-m`:
```bash
$ npm start -- -a YOUR_API_KEY -s YOUR_SECRET_KEY -m MINT_1 MINT_2 MINT_3
```

You can also use environment variables to store your API key and secret key:
```bash
$ export SE_API_KEY=YOUR_API_KEY
$ export SE_SECRET_KEY=YOUR_SECRET_KEY
$ npm start -- -m MINT_1 MINT_2 MINT_3
```