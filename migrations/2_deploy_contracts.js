var GnosisMath = artifacts.require("Math.sol");
var DefaultMarketFactory = artifacts.require("DefaultMarketFactory.sol");
var EtherToken = artifacts.require("EtherToken.sol");
var EventFactory = artifacts.require("EventFactory.sol");
var LMSRMarketMaker = artifacts.require("LMSRMarketMaker.sol");

module.exports = function(deployer) {
  deployer.deploy(GnosisMath)
  deployer.link(GnosisMath, [EventFactory, EtherToken, LMSRMarketMaker]);

  deployer.deploy([DefaultMarketFactory, EtherToken, EventFactory, LMSRMarketMaker])
};
