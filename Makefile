PASSWDFILE = geth/chaindata/acc_passwd

.PHONY: clean install run_miner

start: migrate
	npm start

migrate: build start_miner
	truffle migrate --network geth_dev

start_miner : geth/chaindata
	@ps -A | grep geth || nohup geth/geth --rpc --rpccorsdomain "*" --maxpeers 0 --nodiscover --datadir geth/chaindata --password $(PASSWDFILE) --unlock 0 --mine --minerthreads 1 --rpcapi eth,web3,personal,miner,net,txpool & sleep 3 && ps -A | grep geth || echo Failed to start geth, see nohup.out

geth/chaindata:
	geth/geth --datadir geth/chaindata init geth/genesis.json
	head -c8 /dev/urandom|base32>$(PASSWDFILE)
	geth/geth --datadir geth/chaindata --password $(PASSWDFILE) account new

clean:
	-@killall geth
	-rm -rf geth/chaindata build nohup.out

node_modules:
	npm install

build: node_modules
	truffle compile
