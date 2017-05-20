pragma solidity ^0.4.8;

contract Market {
  uint[] public buyAmounts;
  uint[] public buyPrices;
  address[] public buyOriginators;
  uint[] public sellAmounts;
  uint[] public sellPrices;
  address[] public sellOriginators;
  mapping(address => uint) public collateral;
  mapping(address => int) public balance;
  uint public startTime;
  uint lastDayCumulative;
  uint lastDayVolume;

  function Market() {
    startTime = block.timestamp;
  }

  function isOpen() returns(bool) {
    return startTime + 14 days > block.timestamp;
  }

  function buy(uint amount, uint price) payable {
    uint matchedAmount;

    if (amount * price != msg.value) { throw; }
    if (!isOpen()) { throw; }

    collateral[msg.sender] += msg.value;

    while (amount != 0 && sellPrices.length != 0 && price >= sellPrices[sellPrices.length - 1]) {
      uint sellAmount = sellAmounts[sellAmounts.length - 1];
      address sellOriginator = sellOriginators[sellOriginators.length - 1];
      if (sellAmount > amount) {
        matchedAmount = amount;
        sellAmounts[sellAmounts.length - 1] -= amount;
        amount = 0;
      } else {
        matchedAmount = sellAmount;
        amount -= matchedAmount;
        sellPrices.length--;
        sellAmounts.length--;
        sellOriginators.length--;
      }

      balance[msg.sender] += int(matchedAmount);
      balance[sellOriginator] -= int(matchedAmount);

      if (startTime + 13 days < block.timestamp) {
        lastDayVolume += matchedAmount;
        lastDayCumulative += matchedAmount * price;
      }
    }

    if (amount > 0) {
      uint index = _getBuyIndex(price);
      _addBuyPriceAtIndex(index, price);
      _addBuyAmountAtIndex(index, amount);
      _addBuyOriginatorAtIndex(index, msg.sender);
    }
  }

  function sell(uint amount, uint price) payable {
    uint matchedAmount;

    if (amount * (100 - price) != msg.value) { throw; }
    if (!isOpen()) { throw; }
    
    collateral[msg.sender] += msg.value;

    while (amount != 0 && buyPrices.length != 0 && price <= buyPrices[buyPrices.length - 1]) {
      uint buyAmount = buyAmounts[buyAmounts.length - 1];
      address buyOriginator = buyOriginators[buyOriginators.length - 1];
      if (buyAmount > amount) {
        matchedAmount = amount;
        buyAmounts[buyAmounts.length - 1] -= amount;
        amount = 0;
      } else {
        matchedAmount = buyAmount;
        amount -= matchedAmount;
        buyPrices.length--;
        buyAmounts.length--;
        buyOriginators.length--;
      }

      if (startTime + 13 days < block.timestamp) {
        lastDayVolume += matchedAmount;
        lastDayCumulative += matchedAmount * price;
      }

      balance[msg.sender] -= int(matchedAmount);
      balance[buyOriginator] += int(matchedAmount);
    }

    if (amount > 0) {
      uint index = _getSellIndex(price);
      _addSellPriceAtIndex(index, price);
      _addSellAmountAtIndex(index, amount);
      _addSellOriginatorAtIndex(index, msg.sender);
    }
  }

  function allBuyOrders() returns(uint[], uint[], address[]) {
    return (buyAmounts, buyPrices, buyOriginators);
  }

  function allSellOrders() returns(uint[], uint[], address[]) {
    return (sellAmounts, sellPrices, sellOriginators);
  }

  function cancel() {}

  function avgPrice() returns(uint) {
    if (isOpen()) { throw;}

    return lastDayCumulative/lastDayVolume;
  }

  // Private functions

  function _getBuyIndex(uint price) private returns(uint) {
    uint i = 0;

    for (i; i < buyPrices.length; i++) {
      if (buyPrices[i] > price) {
        return i;
      }
    }

    return i;
  }

  function _addBuyPriceAtIndex(uint index, uint price) private {
    buyPrices.length++;
    for (uint i = buyPrices.length - 1; i > index; i--) {
      buyPrices[i] = buyPrices[i-1]; 
    }

    buyPrices[index] = price;
  }

  function _addBuyAmountAtIndex(uint index, uint amount) private {
    buyAmounts.length++;
    for (uint i = buyAmounts.length - 1; i > index; i--) {
      buyAmounts[i] = buyAmounts[i-1]; 
    }

    buyAmounts[index] = amount;
  }

  function _addBuyOriginatorAtIndex(uint index, address originator) private {
    buyOriginators.length++;
    for (uint i = buyOriginators.length - 1; i > index; i--) {
      buyOriginators[i] = buyOriginators[i-1]; 
    }

    buyOriginators[index] = originator;
  }

  function _getSellIndex(uint price) private returns(uint) {
    uint i = 0;

    for (i; i < sellPrices.length; i++) {
      if (sellPrices[i] < price) {
        return i;
      }
    }

    return i;
  }

  function _addSellPriceAtIndex(uint index, uint price) private {
    sellPrices.length++;
    for (uint i = sellPrices.length - 1; i > index; i--) {
      sellPrices[i] = sellPrices[i-1]; 
    }

    sellPrices[index] = price;
  }

  function _addSellAmountAtIndex(uint index, uint amount) private {
    sellAmounts.length++;
    for (uint i = sellAmounts.length - 1; i > index; i--) {
      sellAmounts[i] = sellAmounts[i-1]; 
    }

    sellAmounts[index] = amount;
  }

  function _addSellOriginatorAtIndex(uint index, address originator) private {
    sellOriginators.length++;
    for (uint i = sellOriginators.length - 1; i > index; i--) {
      sellOriginators[i] = sellOriginators[i-1]; 
    }

    sellOriginators[index] = originator;
  }
}
