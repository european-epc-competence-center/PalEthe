require('babel-register');
require('babel-polyfill');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    "ganache": {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    "geth_dev": {
      host: "localhost",
      port: 8545,
      network_id:"*"
    },
    "ganache_docker": {
      host: "ganache",
      port: 8545,
      network_id:"*"
    },
    "vicky": {
      host: "192.168.20.41",
      port: 8545,
      network_id:"*"
    },
    "quorum-7": {
        host: "172.16.239.11",
        port: 8545,
        network_id:"*",
        gasPrice: 0
      },
      
  }
};
