pragma solidity ^0.4.8;
import "./Proposal.sol";
contract dao{
    uint count = 0;
    address[] proposals;
    mapping(string => address) descs;
    function createProposal(string description) returns (address){
        count = count +1;
        address toReturn = address(new Proposal(description));
        proposals.push(toReturn);
        descs[description] = toReturn;
        return toReturn;
    }
    function getCount() returns (uint){
        return count;
    }
    function getProposals() returns (address[]){
        return proposals;
    }
    function getProposalByDesc(string description) returns (address){
        return descs[description];
    }

    function getProposalByCount(uint index) returns (address) {
        return proposals[index];
    }

}


