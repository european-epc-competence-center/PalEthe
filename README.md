# PalEthe

Pallet receipts via Ethereum

Install
-------

### Once
- Install truffle `npm i -g truffle`
- clone this repo


### Update and Compile
- `cd PalEthe`
- `git pull`
- `npm i`
- `truffle compile`


### Deploy Contracts
- start your ethereum chain node, e.g. `truffle dev` or run ganache (https://truffleframework.com/ganache)
- set port in `truffle.js` accordingly
- `truffle migrate`

### run tests
```
NODE_ENV=development truffle tests
```

### Run backend
```
npm start
```
