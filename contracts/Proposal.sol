pragma solidity ^0.4.8;
import "./Market.sol";
contract Proposal {
    address posMarket;
    address negMarket;
    string desc;

    function Proposal(string description, address _oracle) {
        desc = description; 
        posMarket = new Market(_oracle);
        negMarket = new Market(_oracle);
    }
    function getposMarket() returns (address){
        return posMarket;
    }
    function getnegMarket() returns (address){
        return negMarket;
    }

    function checkAvgPrice(){
        if (Market(posMarket).avgPrice() > (Market(negMarket).avgPrice())){
            (Market(negMarket).cancel());
        } else {
            (Market(posMarket).cancel());
        }
    }

}
