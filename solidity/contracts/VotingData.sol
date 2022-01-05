// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Voting.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract VotingData is Voting{

    using SafeMath for uint256;

    constructor (uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, bytes32[] memory _candidates, bytes32[] memory _whiteStuff, uint256[] memory _publicKey, address _owner) Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whiteListType, _candidates, _whiteStuff, _publicKey, _owner){}

    function getVotes() public view returns (uint256[] memory){
        uint256[] memory allVotes;
        // uint256[] memory allVotes = new uint256[];
        // uint256[] memory allVotes = new uint256[](c.candidateList.length);
        for (uint i = 0; i < c.candidateList.length; i++) {
            allVotes[i] = c.votesReceived[keccak256(abi.encode(bytes32ToString(c.candidateList[i])))];
        }
        // allVotes[0] = c.votesReceived[keccak256(abi.encode(bytes32ToString(c.candidateList[0])))];
        return allVotes;
        // return c.votesReceived[keccak256(abi.encode(bytes32ToString(c.candidateList[0])))];
    }


    /// @param _votes Encrypted number of votes want to add.
    /// @param _email Voter's E-mail address.
    /// @param _domain Domain of voter's E-mail address.
    /// @param _candidates Hashed candidate names.
    function voteWithAddition(uint256[] memory _votes, bytes32 _email, bytes32 _domain, bytes32[] memory _candidates) public {
        if (checkTimelimit() == false) revert('The time for voting has passed.');
        if (checkVoteattempts() == false) revert('Maximum number of votes has been reached.');
        if (usingWhiteEmailAddress() == true && whiteEmailAddressesIncludes(_email) == false) revert('Email address is not whitelistted.');
        if (usingWhiteDomain() == true && whiteDomainsIncludes(_domain) == false) revert('Domain is not whitelisted.');
        if (v.voterID[_email] == 0) revert("BSU student/employee ID is not registered.");
        if (v.voterAddr[_email] != msg.sender) revert("Ethereum address does not match the Ethreum address registered in the email address.");

        v.attemptedVotes[msg.sender] += 1;

            for(uint i = 0; i < _candidates.length; i++) {
            bytes32 _hash = c.candidateHash[_candidates[i]];
            if (validCandidate(_hash) == false) revert('This is a non-existent option/candidate name.');
            c.votesReceived[_hash] = addition(c.votesReceived[_hash], _votes[i]);
        }
    }

    function getPublicKey() public view returns (uint256[2] memory) {
        return [b.publicKey.n, b.publicKey.g];
    }

    /// @notice Parameters for the key to decrypt the number of votes. Can only be called after the voting period is over and by the author of the vote.
    /// @param _privateKey Private key for decrypting votes. _privateKey[0]: lambda, _privateKey[1]: mu
    function setPrivateKey(uint256[] memory _privateKey) public onlyOwner {
        // For Debug mode
        // if (checkTimelimit()) revert ('Voting is now open.'); 
        b.privateKey.lambda = _privateKey[0];
        b.privateKey.mu = _privateKey[1];
    }

    function getPrivateKey() public view returns (uint256[2] memory) {
        // For Debug mode
        // if (checkTimelimit()) revert ('Voting is now open.');
        if (b.privateKey.lambda == 0 && b.privateKey.mu == 0) revert ('No private key uploaded yet.');
        return [b.privateKey.lambda, b.privateKey.mu];
    }

    function addition(uint256 c1, uint256 c2) private view returns (uint256){
        return (c1.mul(c2)).mod(b.publicKey.n ** 2);
    }
    
    uint256 debugNumber = 1;

    function addNumber (uint256 value) public {
        debugNumber = addition(debugNumber, value);
    }

    function getNumber () public view returns (uint256){
        return debugNumber;
    }

    function setNumber (uint256 value) public {
        debugNumber = value;
    }
}

