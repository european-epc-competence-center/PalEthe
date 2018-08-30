var PalEthe = artifacts.require("./PalEthe.sol");
var Partners = artifacts.require("./Partners.sol");

module.exports = function(deployer) {
  deployer.deploy(PalEthe);
  deployer.deploy(Partners);
};
