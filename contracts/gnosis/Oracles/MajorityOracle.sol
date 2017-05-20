pragma solidity 0.4.11;
import "../Oracles/AbstractOracle.sol";


/// @title Majority oracle contract - Allows to resolve an event based on multiple oracles with majority vote
/// @author Stefan George - <stefan@gnosis.pm>
contract MajorityOracle is Oracle {

    /*
     *  Storage
     */
    Oracle[] public oracles;

    /*
     *  Public functions
     */
    /// @dev Allows to create an oracle for a majority vote based on other oracles
    /// @param _oracles List of oracles taking part in the majority vote
    function MajorityOracle(Oracle[] _oracles)
        public
    {
        if (_oracles.length < 2)
            // At least 2 oracles should be defined
            revert();
        for (uint i=0; i<_oracles.length; i++)
            if (address(_oracles[i]) == 0)
                revert();
        oracles = _oracles;
    }

    /// @dev Allows to registers oracles for a majority vote
    /// @return Returns if outcome is set
    /// @return Returns outcome
    function getStatusAndOutcome()
        public
        returns (bool outcomeSet, int outcome)
    {
        uint i;
        int[] memory outcomes = new int[](oracles.length);
        uint[] memory validations = new uint[](oracles.length);
        for (i=0; i<oracles.length; i++)
            if (oracles[i].isOutcomeSet()) {
                int _outcome = oracles[i].getOutcome();
                for (uint j=0; j<=i; j++)
                    if (_outcome == outcomes[j]) {
                        validations[j] += 1;
                        break;
                    }
                    else if (validations[j] == 0) {
                        outcomes[j] = _outcome;
                        validations[j] = 1;
                        break;
                    }
            }
        uint outcomeValidations = 0;
        uint outcomeIndex = 0;
        for (i=0; i<oracles.length; i++)
            if (validations[i] > outcomeValidations) {
                outcomeValidations = validations[i];
                outcomeIndex = i;
            }
        // There is a majority vote
        if (outcomeValidations * 2 > oracles.length) {
            outcomeSet = true;
            outcome = outcomes[outcomeIndex];
        }
    }

    /// @dev Returns if winning outcome is set for given event
    /// @return Returns if outcome is set
    function isOutcomeSet()
        public
        constant
        returns (bool)
    {
        var (outcomeSet, ) = getStatusAndOutcome();
        return outcomeSet;
    }

    /// @dev Returns winning outcome for given event
    /// @return Returns outcome
    function getOutcome()
        public
        constant
        returns (int)
    {
        var (, winningOutcome) = getStatusAndOutcome();
        return winningOutcome;
    }
}
