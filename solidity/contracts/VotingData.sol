// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Voting.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract VotingData is Voting{

    using SafeMath for uint256;

    event newBigInteger1024(string name, uint x1, uint x256, uint x512, uint x768);
    event newBigInteger2048(string name, uint x1, uint x256, uint x512, uint x768, uint x1024, uint x1280, uint x1536, uint x1792);

    constructor (uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, bytes32[] memory _candidates, bytes32[] memory _whiteStuff, uint256[] memory _publicKey, address _owner) Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whiteListType, _candidates, _whiteStuff, _publicKey, _owner){}

    /// @notice Stores a huge integer up to 1024.
    /// @dev value = x1 + x256 * 2 ** 256 + x512 * 2 ** 512 + x768 * 2 ** 768
    struct BigInteger1024 {
        uint x1;
        uint x256;
        uint x512;
        uint x768;
    }

    /// @notice Stores a huge integer up to 2048.
    /// @dev value = x1 + x256 * 2 ** 256 + ... + x1792 * 2 ** 1792
    struct BigInteger2048 {
        uint x1;
        uint x256;
        uint x512;
        uint x768;
        uint x1024;
        uint x1280;
        uint x1536;
        uint x1792;
    }

    BigInteger1024 n;
    BigInteger2048 g;
    BigInteger1024 lambda;
    BigInteger1024 mu;

    BigInteger2048 debugNumber = BigInteger2048(1, 0, 0, 0, 0, 0, 0, 0);

    /*

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
            // c.votesReceived[_hash] = addition(c.votesReceived[_hash], _votes[i]);
        }
    }

    */

    function setPublicKey(uint256[] memory _n, uint256[] memory _g) public onlyOwner {
        n = BigInteger1024(_n[0], _n[1], _n[2], _n[3]);
        g = BigInteger2048(_g[0], _g[1], _g[2], _g[3], _g[4], _g[5], _g[6], _g[7]);
        emit newBigInteger1024('set n', _n[0], _n[1], _n[2], _n[3]);
        emit newBigInteger2048('set g', _g[0], _g[1], _g[2], _g[3], _g[4], _g[5], _g[6], _g[7]);
    }

    function getPublicKey() public view returns (uint256[12] memory) {
        return [n.x1, n.x256, n.x512, n.x768, g.x1, g.x256, g.x512, g.x768, g.x1024, g.x1280, g.x1536, g.x1792];
    }

    /// @notice Parameters for the key to decrypt the number of votes. Can only be called after the voting period is over and by the author of the vote.
    /// @param _lambda lambda of private key for decrypting votes. lambda[0]: reminder of value, lambda[1]: reminder of quotient, lambda[2]: quotient of quotient
    /// @param _mu mu of private key for decrypting votes. mu[0]: reminder of value, mu[1]: reminder of quotient, mu[2]: quotient of quotient
    function setPrivateKey(uint256[] memory _lambda, uint256[] memory _mu) public onlyOwner {
        // For Debug mode
        // if (checkTimelimit()) revert ('Voting is now open.'); 
        lambda = BigInteger1024(_lambda[0], _lambda[1], _lambda[2], _lambda[3]);
        mu = BigInteger1024(_mu[0], _mu[1], _mu[2], _mu[3]);
        emit newBigInteger1024('set lambda', _lambda[0], _lambda[1], _lambda[2], _lambda[3]);
        emit newBigInteger1024('set mu', _mu[0], _mu[1], _mu[2], _mu[3]);
    }

    function getPrivateKey() public view returns (uint256[8] memory) {
        // For Debug mode
        // if (checkTimelimit()) revert ('Voting is now open.');
        if (lambda.x1 == 0 && lambda.x256 == 0 && lambda.x512 == 0 && lambda.x768 == 0) revert ('No private key uploaded yet.');
        return [lambda.x1, lambda.x256, lambda.x512, lambda.x768, mu.x1, mu.x256, mu.x512, mu.x768];
    }

    function setNumber (uint256[] memory values_) public {
        debugNumber = BigInteger2048(values_[0], values_[1], values_[2], values_[3], values_[4], values_[5], values_[6], values_[7]);
        emit newBigInteger2048('set debugNumber', values_[0], values_[1], values_[2], values_[3], values_[4], values_[5], values_[6], values_[7]);
    }

    function getNumber () public view returns (uint256[8] memory){
        return [debugNumber.x1, debugNumber.x256, debugNumber.x512, debugNumber.x768, debugNumber.x1024, debugNumber.x1280, debugNumber.x1536, debugNumber.x1792];
    }

}

