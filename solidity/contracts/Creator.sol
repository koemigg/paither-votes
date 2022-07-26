// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Voting.sol";

/// @title Creator
/// @notice A contract that creates a Voting contract. Through this contract, the vote creator creates a voting event, and the voter retrieves the voting event.
contract Creator {

    event newVotingContractEvent(
       address contractAddress
    );

    mapping (uint32 => address) votes;      // Ballot ID => Voting conract address
    mapping (address => uint32) ballotIds;  // Voting conract address => Ballot ID 
    
    address owner;

    /// @notice Create a new ballot
    /// @param _timeLimit Voting Period (Unix Time)
    /// @param _ballotType The format of the vote. 0: poll, 1: election
    /// @param _voteLimit Maximum number of vote
    /// @param _ballotId A value to access a specific Voting contract.
    /// @param _title Title
    /// @param _whiteListType Whitelist type. 0: Non-whitelist, 1: E-mail, 2: domain
    /// @param _candidates Candisates or choices.
    /// @param _whiteStuff Whitelisted E-mail addresses or domains. 
    /// @param _n n of Public key for encrypting votes.
    /// @param _g g of Public key for encrypting votes.
    /// @dev Wrapper of new Voting(). All information about the vote, including deadlines and choices, is passed here to initialize the ballot.
    function createBallot(uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, bytes32[] memory _candidates, bytes32[] memory _whiteStuff, uint[] memory _n, uint[] memory _g)
    public {
        Voting newVoting = new Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whiteListType, _candidates, _whiteStuff, _n, _g, msg.sender);
        votes[_ballotId] = address(newVoting);
        ballotIds[address(newVoting)] = _ballotId;
        emit newVotingContractEvent(address(newVoting));
    }

    /// @notice Address getter by ballot ID.
    /// @param _ballotId Ballot ID
    /// @return Address corresponding to the ballot indicated by the ballot ID.
    function getAddress(uint32 _ballotId) public view returns(address) {
        return votes[_ballotId];
    }

    /// @notice Ballot ID getter by addrress.
    /// @param _adddress Addrress
    /// @return Ballot ID corresponding to the ballot indicated by the addrress.
    function getBallotId(address _voting) public view returns(uint32 _ballotId) {
        return ballotIds[_voting];
    }
}
