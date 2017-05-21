var Market = artifacts.require("Market.sol");
var Tempo = require('@digix/tempo');
var Oracle = artifacts.require("oracle.sol");

contract('Market', function(accounts) {
  it("should set start time on creation", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.startTime.call(); }).
      then(function(result) {
        assert.notEqual(result, 0);
      });
  });

  it("should close after 14 days", function() {
    var market;

    return new Tempo.default(web3).then((tempo) => {
      return Market.new().then(function(instance) { market = instance }).
        then(function() { return market.isOpen.call(); }).
        then(function(result) {
          assert.equal(result, true);
        }).
        then(function() { return tempo.waitForBlocks(1, 15*24*60*60) }).
        then(function() { return market.isOpen.call(); }).
        then(function(result) {
          assert.equal(result, false);
        });
    });
  });

  it("should allow withdrawal of collateral if cancelled", function() {
    var market;

    return new Tempo.default(web3).then((tempo) => {
      return Market.new().then(function(instance) { market = instance }).
        then(function() { return market.sell(10, 50, {value: 500}) }).
        then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
        then(function() { return tempo.waitForBlocks(1, 15*24*60*60) }).
        then(function() { return market.cancel(); }).
        then(function() { return market.withdraw(); }).
        then(function() { return market.collateral.call(accounts[0]) }).
        then(function(result) {
          assert.equal(result, 0);
        }).
        then(function() { return market.collateralBalance.call(); }).
        then(function(result) {
          assert.equal(result, 500);
        });
    });
  });

  it("should allow withdrawal of buy winnings after 90 days", function() {
    var market;
    var oracle;

    return new Tempo.default(web3).then((tempo) => {
      return Oracle.new(70).
        then(function(result) { oracle = result }).
        then(function() { return Market.new(oracle.address) }).
        then(function(instance) { market = instance }).
        then(function() { return market.sell(10, 50, {value: 500}) }).
        then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
        then(function() { return tempo.waitForBlocks(1, 91*24*60*60) }).
        then(function() { return market.withdraw(); }).
        then(function() { return market.balances.call(accounts[0]) }).
        then(function(result) {
          assert.equal(result, 0);
        }).
        then(function() { return market.collateralBalance.call(); }).
        then(function(result) {
          assert.equal(result, 700);
        });
    });
  });

  it("should allow withdrawal of sell winnings after 90 days", function() {
    var market;
    var oracle;

    return new Tempo.default(web3).then((tempo) => {
      return Oracle.new(70).
        then(function(result) { oracle = result }).
        then(function() { return Market.new(oracle.address) }).
        then(function(instance) { market = instance }).
        then(function() { return market.sell(10, 50, {value: 500}) }).
        then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
        then(function() { return tempo.waitForBlocks(1, 91*24*60*60) }).
        then(function() { return market.withdraw({from: accounts[1]}); }).
        then(function() { return market.balances.call(accounts[1]) }).
        then(function(result) {
          assert.equal(result, 0);
        }).
        then(function() { return market.collateralBalance.call(); }).
        then(function(result) {
          assert.equal(result, 300);
        });
    });
  });

  it("should keep track of average for last 24 hours", function() {
    var market;

    return new Tempo.default(web3).then((tempo) => {
      return Market.new().then(function(instance) { market = instance }).
        then(function() { return market.sell(10, 50, {value: 500}) }).
        then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
        then(function() { return tempo.waitForBlocks(1, 13*24*60*60 + 1) }).
        then(function() { return market.sell(10, 50, {value: 500}) }).
        then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
        then(function() { return market.buy(10, 60, {value: 600, from: accounts[1]}) }).
        then(function() { return market.sell(10, 60, {value: 400}) }).
        then(function() { return tempo.waitForBlocks(1, 1*24*60*60 + 1) }).
        then(function() { return market.avgPrice.call() }).
        then(function(result) {
          assert.equal(result, 55);
        });
    });
  });

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

  it("should let buys match existing sell orders", function() {
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
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, -10);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, 10);
      });
  });

  it("should let buys match part of an existing sell order", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(100, 50, {value: 5000}) }).
      then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 1);
        assert.equal(result[0][0], 90);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, -10);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, 10);
      });
  });

  it("should let buys match multiple existing sell orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(5, 49, {value: 255}) }).
      then(function() { return market.sell(5, 50, {value: 250}) }).
      then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, -10);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, 10);
      });
  });

  it("should let buys that don't fully match become partial limit orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.sell(5, 49, {value: 255}) }).
      then(function() { return market.sell(5, 51, {value: 245}) }).
      then(function() { return market.buy(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 1);
        assert.equal(result[1][0], 51);
      }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 1);
        assert.equal(result[0][0], 5);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, -5);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, 5);
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
      then(function() { return market.sell(10, 35, {value: 650}) }).
      then(function() { return market.sell(10, 30, {value: 700}) }).
      then(function() { return market.sell(10, 39, {value: 610}) }).
      then(function() { return market.sell(10, 36, {value: 640}) }).
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

  it("should let sells match existing buy orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(10, 50, {value: 500}) }).
      then(function() { return market.sell(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 10);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, -10);
      });
  });

  it("should let buys match part of an existing sell order", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(100, 50, {value: 5000}) }).
      then(function() { return market.sell(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 1);
        assert.equal(result[0][0], 90);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 10);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, -10);
      });
  });

  it("should let buys match multiple existing sell orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(5, 51, {value: 255}) }).
      then(function() { return market.buy(5, 50, {value: 250}) }).
      then(function() { return market.sell(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.allSellOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 0);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 10);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, -10);
      });
  });

  it("should let buys that don't fully match become partial limit orders", function() {
    var market;

    return Market.new().then(function(instance) { market = instance }).
      then(function() { return market.buy(5, 49, {value: 245}) }).
      then(function() { return market.buy(5, 51, {value: 255}) }).
      then(function() { return market.sell(10, 50, {value: 500, from: accounts[1]}) }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 1);
        assert.equal(result[1][0], 49);
      }).
      then(function() { return market.allBuyOrders.call() }).
      then(function(result) {
        assert.equal(result[0].length, 1);
        assert.equal(result[0][0], 5);
      }).
      then(function() { return market.balances(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 5);
      }).
      then(function() { return market.balances(accounts[1]) }).
      then(function(result) {
        assert.equal(result, -5);
      });
  });
});
