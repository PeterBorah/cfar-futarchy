pragma solidity ^0.4.11;

contract Market {
  uint[] public buyAmounts;
  uint[] public buyPrices;
  address[] public buyOriginators;

  function buy(uint amount, uint price) payable {
    buyAmounts.push(amount);
    buyPrices.push(price);
    buyOriginators.push(msg.sender); 
  }

  function allBuyOrders() returns(uint[], uint[], address[]) {
    return (buyAmounts, buyPrices, buyOriginators);
  }
}
