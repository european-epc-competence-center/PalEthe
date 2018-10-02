PASSWDFILE = geth/chaindata/acc_passwd

.PHONY: clean install start stop buil

start: migrate
	-npm start

stop:
	-@killall geth npm node
	-@docker container stop ganache

clean: stop
	-@rm -rf geth/chaindata build nohup.out
	@echo [OK] cleaned

# proxy. Switch to geth to test on a real chain
migrate: migrate_to_ganache_cli
	@echo "[OK] contracts deployed"

node_modules:
	npm install

# truffle compile creates the build folder
build: node_modules
	@echo [...] compiling solidity contracts
	truffle compile
	@echo [OK] compiled

#using dev in-memory BC
migrate_to_ganache_cli: run_ganache_cli
	@echo [...] migrating to ganache_cli
	truffle migrate --network geth_dev

run_ganache_cli:
	@docker container ls |grep ganache || (docker run --rm -d -p 8545:8545 --name ganache trufflesuite/ganache-cli:latest && echo "[OK] in-memory BC running")

# using a real geth backend:
migrate_to_geth: build run_geth_node
	truffle migrate --network geth_dev

run_geth_node : geth/chaindata
	@ps -A | grep geth || (nohup geth/geth --rpc --rpccorsdomain "*" --maxpeers 0 --nodiscover --datadir geth/chaindata --password $(PASSWDFILE) --unlock 0 --mine --minerthreads 1 --rpcapi eth,web3,personal,miner,net,txpool & sleep 30; ps -A | grep geth || (echo; echo [Failed] to start geth; tail nohup.out; exit 1))

geth/chaindata:
	geth/geth --datadir geth/chaindata init geth/genesis.json
	head -c8 /dev/urandom|base32>$(PASSWDFILE)
	geth/geth --datadir geth/chaindata --password $(PASSWDFILE) account new
	geth/geth --datadir geth/chaindata --password $(PASSWDFILE) account new
