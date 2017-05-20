pragma solidity ^0.4.8;
contract oracle{
    uint utility;
    function Oracle(uint initUtility){
        if(initUtility > 100 || initUtility <0){
            utility = 100;
        } else{
        utility = initUtility;
        }
    }
    function updateUtility(uint newUtility) returns (bool success){
        if(newUtility > 100 || newUtility < 0){
            return false;
        }
        utility = newUtility;
        return true;
    }

    function getUtility() returns (uint utility) {
        return utility;
    }
}