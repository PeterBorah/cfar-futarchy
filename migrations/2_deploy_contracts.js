var Dao = artifacts.require("./dao.sol");
var Oracle = artifacts.require("./oracle.sol");

module.exports = function(deployer) {
  var oracle;

  deployer.deploy(Oracle);
  deployer.then(function() { return Oracle.deployed() }).
    then(function(result) { oracle = result }).
    then(function() { return deployer.deploy(Dao, oracle.address); });
};
