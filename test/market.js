var Market = artifacts.require("./Market.sol");

contract('Market', function(accounts) {
  it("should allow new buy orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
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

  it("should order buy orders by price, low to high", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(10, 99, {value: 990}) }).
      then(function() { return market.buy(10, 95, {value: 950}) }).
      then(function() { return market.buy(10, 90, {value: 900}) }).
      then(function() { return market.buy(10, 96, {value: 990}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result.length, 3);
        assert.equal(result[0].length, 4);
        assert.equal(result[0][0], 10);
        assert.equal(result[1][0], 90);
        assert.equal(result[2][0], accounts[0]);
        assert.equal(result[0][1], 10);
        assert.equal(result[1][1], 95);
        assert.equal(result[2][1], accounts[0]);
        assert.equal(result[0][2], 10);
        assert.equal(result[1][2], 96);
        assert.equal(result[2][2], accounts[0]);
        assert.equal(result[0][3], 10);
        assert.equal(result[1][3], 99);
        assert.equal(result[2][3], accounts[0]);
      });
  });

  it("should allow new sell orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(10, 35, {value: 950}) }).
      then(function() { return market.sell(10, 30, {value: 900}) }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result.length, 3);
        assert.equal(result[0].length, 2);
        assert.equal(result[0][0], 10);
        assert.equal(result[1][0], 35);
        assert.equal(result[2][0], accounts[0]);
        assert.equal(result[0][1], 10);
        assert.equal(result[1][1], 30);
        assert.equal(result[2][1], accounts[0]);
      });
  });

  it("should order sell orders by price, high to low", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(10, 36, {value: 990}) }).
      then(function() { return market.sell(10, 39, {value: 990}) }).
      then(function() { return market.sell(10, 30, {value: 900}) }).
      then(function() { return market.sell(10, 35, {value: 950}) }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result.length, 3);
        assert.equal(result[0].length, 4);
        assert.equal(result[0][0], 10);
        assert.equal(result[1][0], 39);
        assert.equal(result[2][0], accounts[0]);
        assert.equal(result[0][1], 10);
        assert.equal(result[1][1], 36);
        assert.equal(result[2][1], accounts[0]);
        assert.equal(result[0][2], 10);
        assert.equal(result[1][2], 35);
        assert.equal(result[2][2], accounts[0]);
        assert.equal(result[0][3], 10);
        assert.equal(result[1][3], 30);
        assert.equal(result[2][3], accounts[0]);
      });
  });
});
