var PalEthe = artifacts.require("./PalEthe.sol");
var Partners = artifacts.require("./Partners.sol");
var Announce = artifacts.require("./Announce.sol");

module.exports = function(deployer) {
  deployer.deploy(PalEthe);
  deployer.deploy(Partners);
  deployer.deploy(Announce);
};
