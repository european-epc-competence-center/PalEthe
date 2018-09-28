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
      host: "127.0.0.1",
      port: 8545,
      network_id:"*"
    },
    "truffle_dev": {
      host: "127.0.0.1",
      port: 9545,
      network_id:"*"
    }
  }
};
