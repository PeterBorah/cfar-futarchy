pragma solidity ^0.4.8;
import "./Market.sol";
import "./marketFactory.sol";
contract Proposal {
    address posMarket;
    address negMarket;
    string desc;
    function Proposal(string description) {
        desc = description; 
        marketFactory fact = new marketFactory();
        posMarket = fact.createMarket();
        negMarket = fact.createMarket();
    }
    function getposMarket() returns (address){
        return posMarket;
    }
    function getnegMarket() returns (address){
        return negMarket;
    }

    function checkAvgPrice(){
        if (Market(posMarket).avgPrice() > Market(negMarket).avgPrice()){
            Market(negMarket).cancel();
        } else {
            Market(posMarket).cancel();
        }
    }

}