# PalEthe

This is an add-on project to the GS1 Pallettenschein
https://www.gs1-germany.de/innovation/trendforschung/blockchain/pilot/

The Participants may publish their current total balance (pairwise) any time. On top of this data, value adding services like ring exchanges can be implemented.


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
