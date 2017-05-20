pragma solidity ^0.4.8;
import "./market.sol";
import "./marketFactory.sol";
contract dao{
    uint count = 0;
    address[] proposals;
    mapping(string => address) descs;
    function dao(){
    }
    function createProposal(string description) returns (address proposal){
        count = count +1;
        address toReturn = address(new Proposal(description));
        proposals.push(toReturn);
        descs[description] = toReturn;
        return toReturn;
    }
    function getCount() returns (uint count){
        return count;
    }
    function getProposals() returns (address[] proposals){
        return proposals;
    }
    function getProposalByDesc(string description) returns (address proposal){
        return descs[description];
    }

    function getProposalByCount(uint count) returns (address proposal) {
        return proposals[count];
    }

}

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
    function getposMarket() returns (address posMarket){
        return posMarket;
    }
    function getnegMarket() returns (address negMarket){
        return negMarket;
    }

    function checkAvgPrice(){
        if (market(posMarket).avgPrice() > market(negMarket).avgPrice()){
            market(negMarket).cancel();
        } else {
            market(posMarket).cancel();
        }
    }

}