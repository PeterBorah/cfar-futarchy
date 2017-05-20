var Market = artifacts.require("./Market.sol");

contract('Market', function(accounts) {
  it("should allow new buy orders", function() {
    var market;

    return Market.deployed().then(function(instance) { market = instance }).
      then(function() { return market.buy(10, 90, {value: 900}) }).
      then(function() { return market.buy(10, 95, {value: 950}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result.length, 3);
        assert.equal(result[0].length, 2);
        assert.equal(result[0][0], 10);
        assert.equal(result[1][0], 90);
        assert.equal(result[2][0], accounts[0]);
        assert.equal(result[0][1], 10);
        assert.equal(result[1][1], 95);
        assert.equal(result[2][1], accounts[0]);
      });
  });
});
