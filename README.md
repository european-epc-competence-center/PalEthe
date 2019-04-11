# PalEthe

This is an add-on project to the GS1 Pallettenschein
https://www.gs1-germany.de/innovation/trendforschung/blockchain/pilot/
.
The aim is to only publish aggregated (pallet exchange) data on an Ethereum (type) Chain using smart contracts.


The Participants may publish their current total balance (pairwise)
any time. Mutual signatures are handled via a smart contract, which
also keeps track of the total mutual balances at any time in a
convenient manner. On top of this data, value adding services like
ring exchanges can be implemented.

Further more, an announcement contract is provided to announce
informations of the form: I currently need/want to get rid of a
certain amount (of pallets) at a certain place.  This data can be used
as the basis for a regional pallet exchange.

Run
---

- clone this repo

- you might want to change the web3 fallback ip in the `docker-compose.yml' (if in doubt, just remove it)

- `docker-compose up`

- navigate to http://localhost:3000

The minimal UI can be used to test the contracts basic functionality.

Run Tests
---------

```
cd eecc_chain_app
truffle compile
ganache-cli &
truffle migrate --network geth_dev
NODE_ENV=test truffle test --network geth_dev
```

This is just an example, you may of course run some other local Ethereum client for your tests and choose the appropriate network.


License
-------
Copyright 2018-2019 European EPC Competence Center GmbH (EECC)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
