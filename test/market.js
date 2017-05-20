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
      then(function() { return market.buy(10, 96, {value: 960}) }).
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

  it("should keep track of collateral for buy orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(10, 90, {value: 900}) }).
      then(function() { return market.buy(10, 95, {value: 950}) }).
      then(function() { return market.collateral.call(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 1850);
      });
  });

  it("should throw for buys with insufficient collateral", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(10, 99, {value: 900}) }).
      then(assert.fail, function(){});
  });

  xit("should let buys match existing sell orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(10, 50, {value: 500}) }).
      then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.balanceOf(accounts[0]) }).
      then(function(result) {
        assert.equal(result, -10);
      }).
      then(function() { return market.balanceOf(accounts[1]) }).
      then(function(result) {
        assert.equal(result, 10);
      });
  });

  it("should allow new sell orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(10, 35, {value: 650}) }).
      then(function() { return market.sell(10, 30, {value: 700}) }).
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
      then(function() { return market.sell(10, 36, {value: 640}) }).
      then(function() { return market.sell(10, 39, {value: 610}) }).
      then(function() { return market.sell(10, 30, {value: 700}) }).
      then(function() { return market.sell(10, 35, {value: 650}) }).
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

  it("should throw for sells with insufficient collateral", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(10, 30, {value: 500}) }).
      then(assert.fail, function(){});
  });

  it("should keep track of collateral for sell orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(10, 10, {value: 900}) }).
      then(function() { return market.sell(10, 5, {value: 950}) }).
      then(function() { return market.collateral.call(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 1850);
      });
  });
});
