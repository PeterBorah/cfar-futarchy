pragma solidity ^0.4.8;
import "./market.sol";
contract marketFactory {
    function createMarket() returns (address mark){
        return address(new market());
    }
}