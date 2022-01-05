// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Voting.sol";

contract Creator {

    event newVotingContractEvent(
       address contractAddress
    );

    mapping (uint32 => address) votes;      // Ballot ID => Voting conract address
    mapping (address => uint32) ballotIds;  // Voting conract address => Ballot ID 
    
    address owner;

    function createBallot(uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, bytes32[] memory _candidates, bytes32[] memory _whiteStuff, uint256[] memory _publicKey)
    public {
        Voting newVoting = new Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whiteListType, _candidates, _whiteStuff, _publicKey, msg.sender);
        votes[_ballotId] = address(newVoting);
        ballotIds[address(newVoting)] = _ballotId;
        emit newVotingContractEvent(address(newVoting));
    }

    function getAddress(uint32 _ballotId) public view returns(address) {
        return votes[_ballotId];
    }

    function getBallotId(address _voting) public view returns(uint32 _ballotId) {
        return ballotIds[_voting];
    }
}
