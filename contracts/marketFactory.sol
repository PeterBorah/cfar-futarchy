pragma solidity ^0.4.8;
import "./Market.sol";
contract marketFactory {
    function createMarket() returns (address mark){
        return address(new Market());
    }
}
