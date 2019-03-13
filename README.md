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

Run Tests
---------

```
cd eecc_chain_app
truffle compile
ganache-cli &
truffle migrate --network geth_dev
truffle test --network geth_dev
NODE_ENV=test truffle test --network geth_dev
```

This is just an example, you may of course run some other local Ethereum client for your tests and choose the appropriate network.
