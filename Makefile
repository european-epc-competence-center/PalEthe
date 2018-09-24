PASSWDFILE = geth/chaindata/acc_passwd

.PHONY: clean install run_miner

start: migrate
	npm start

migrate: build start_miner
	truffle migrate --network geth_dev

start_miner : geth/chaindata
	@ps -A | grep geth || (nohup geth/geth --rpc --rpccorsdomain "*" --maxpeers 0 --nodiscover --datadir geth/chaindata --password $(PASSWDFILE) --unlock 0 --mine --minerthreads 1 --rpcapi eth,web3,personal,miner,net,txpool & sleep 10; ps -A | grep geth || (echo; echo [Failed] to start geth; tail nohup.out; exit 1))

geth/chaindata:
	geth/geth --datadir geth/chaindata init geth/genesis.json
	head -c8 /dev/urandom|base32>$(PASSWDFILE)
	geth/geth --datadir geth/chaindata --password $(PASSWDFILE) account new
	geth/geth --datadir geth/chaindata --password $(PASSWDFILE) account new

clean:
	-@killall geth
	-@rm -rf geth/chaindata build nohup.out
	@echo cleaned

node_modules:
	npm install

build: node_modules
	truffle compile
