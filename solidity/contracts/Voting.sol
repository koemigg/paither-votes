// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

// contract VotingData is Voting{
contract Voting{

    /// ============ Libraries ============

    using SafeMath for uint256;

    /// ============ Types ============

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

    struct Ballot {
        uint8 ballotType;
        uint32 ballotId;    // 特定のVotingコントラクトにアクセスするための値
        uint8 voteLimit;    // 投票回数の制限
        uint32 timeLimit;   // 投票期間
        string title;       // タイトル
        uint8 whiteListType;                        // 投票に個別なEmailアドレスのホワイトリストの形式
        bytes32[] whiteEmailAddresses;              // 投票に個別なEmailアドレスのホワイトリスト
        bytes32[] whiteDomains;                     // 投票に個別なEmailアドレスのドメインのホワイトリスト
    }

    struct Candidates {
        bytes32[] candidateList;
        mapping (bytes32 => BigInteger2048) votes;
    }

    struct Voters {
        mapping (address => uint8) voteCounts;
        mapping (address => uint16) ids;
        mapping (address => bytes32) emails;
    }

    /// ============ Mutable storage ============

    address owner;

    BigInteger1024 n;
    BigInteger2048 g;
    BigInteger1024 lambda;
    BigInteger1024 mu;

    Ballot ballot;
    Candidates candidates;
    Voters voters;


    /// ============ Events ============

    event newBigInteger1024(string name, uint x1, uint x256, uint x512, uint x768);
    event newBigInteger2048(string name, uint x1, uint x256, uint x512, uint x768, uint x1024, uint x1280, uint x1536, uint x1792);

    // constructor (uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, bytes32[] memory _candidates, bytes32[] memory _whiteStuff, uint256[] memory _publicKey, address _owner) Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whiteListType, _candidates, _whiteStuff, _publicKey, _owner){}

    /// ============ Main Functions ============

    /// @param _timeLimit Voting Period
    /// @param _ballotType The format of the vote. 0: poll, 1: election
    /// @param _voteLimit Maximum number of vote
    /// @param _ballotId A value to access a specific Voting contract.
    /// @param _title Title
    /// @param _whiteListType Whitelist type. 0: Non-whitelist, 1: E-mail, 2: domain
    /// @param _candidates Candisates or choices.
    /// @param _whiteStuff Whitelisted E-mail addresses or domains. 
    /// @param _n n of Public key for encrypting votes.
    /// @param _g g of Public key for encrypting votes.
    /// @param _owner Administrator's address
    constructor (uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, bytes32[] memory _candidates, bytes32[] memory _whiteStuff, uint[] memory _n, uint[] memory _g, address _owner) {
        ballot.timeLimit = _timeLimit;
        ballot.ballotType = _ballotType;
        ballot.voteLimit = _voteLimit;
        ballot.ballotId = _ballotId;
        ballot.title = _title;
        ballot.whiteListType = _whiteListType;

        /// @notice Initialize the number of votes received.
        /// @dev The reason for the initial received value of 1: 1 == decrypted　0.
        /// Because using a cryptographic scheme that adds up exponents. (PAILLER cipher)
        for(uint i = 0; i < _candidates.length; i++) {
            candidates.candidateList.push(_candidates[i]);
            candidates.votes[_candidates[i]] = BigInteger2048(1, 0, 0, 0, 0, 0, 0, 0);
        }

        if (_whiteListType == 1){
            for(uint i = 0; i < _whiteStuff.length; i++) {
                ballot.whiteEmailAddresses.push(_whiteStuff[i]);
            }
        } else if (_whiteListType == 2){
            for(uint i = 0; i < _whiteStuff.length; i++) {
                ballot.whiteDomains.push(_whiteStuff[i]);
            }
        } else if (_whiteListType != 0){
            revert('Invalid whitelist type.');
        }

        n = BigInteger1024(_n[0], _n[1], _n[2], _n[3]);
        g = BigInteger2048(_g[0], _g[1], _g[2], _g[3], _g[4], _g[5], _g[6], _g[7]);

        owner = _owner;
    }


    modifier onlyOwner {
        require(msg.sender == owner, "Sender not authorized.");
        _;
    }

    function register(bytes32 _email, uint16 _id, bytes32 _domain) public {
        if (usingWhiteEmailAddress() == true && whiteEmailAddressesIncludes(_email) == false) revert('Email address is not whitelisted.');
        if (usingWhiteDomain() == true && whiteDomainsIncludes(_domain) == false) revert('Domain is not whitlisted.');
        voters.ids[msg.sender] = _id;
        voters.emails[msg.sender] = _email;
    }

    /// @param _ballotId Ballot ID.
    function getCandidateList(uint64 _ballotId) public view returns (bytes32[] memory) {
        if (validBallotId(_ballotId) == false) revert('BallotID does not match');
        return candidates.candidateList;
    }

    function getVotes(bytes32 _candidate) public view returns (uint[8] memory) {
        return [candidates.votes[_candidate].x1, candidates.votes[_candidate].x256, candidates.votes[_candidate].x512, candidates.votes[_candidate].x768, candidates.votes[_candidate].x1024, candidates.votes[_candidate].x1280, candidates.votes[_candidate].x1536, candidates.votes[_candidate].x1792];
    }
    

    function getPublicKey() public view returns (uint256[12] memory) {
        return [n.x1, n.x256, n.x512, n.x768, g.x1, g.x256, g.x512, g.x768, g.x1024, g.x1280, g.x1536, g.x1792];
    }

    /// @param _votes Updated voting details
    /// @param _email Voter's E-mail address
    /// @param _domain Vote's domain of E-mail address
    function vote(uint256[] memory _votes, bytes32 _email, bytes32 _domain) public {
        if (isOpen() == false) revert('The time for voting has passed.');
        if (reachMaxVote() == true) revert('Maximum number of votes has been reached.');
        if (usingWhiteEmailAddress() == true && whiteEmailAddressesIncludes(_email) == false) revert('Email address is not whitelistted.');
        if (usingWhiteDomain() == true && whiteDomainsIncludes(_domain) == false) revert('Domain is not whitelisted.');
        if (voters.ids[msg.sender] == 0) revert("BSU student/employee ID is not registered.");
        if (voters.emails[msg.sender] != _email) revert("Ethereum address does not match the registered email address.");

        voters.voteCounts[msg.sender] += 1;

        for(uint i = 0; i < candidates.candidateList.length; i++) {
            candidates.votes[candidates.candidateList[i]] = BigInteger2048(_votes[0], _votes[1], _votes[2], _votes[3], _votes[4], _votes[5], _votes[6], _votes[7]);
        }
    }

    /* TODO this
    function getAllVotes() public view returns (uint[] memory){
        uint[] memory allVotes;
        // uint256[] memory allVotes = new uint256[];
        // uint256[] memory allVotes = new uint256[](c.candidateList.length);
        for (uint i = 0; i < candidates.candidateList.length; i++) {
            allVotes[i] = candidates.votes[candidates.candidateList[i]].x1;
        }
        return allVotes;
    }
    */

    /// @notice Parameters for the key to decrypt the number of votes. Can only be called after the voting period is over and by the author of the vote.
    /// @param _lambda lambda of private key for decrypting votes. lambda[0]: reminder of value, lambda[1]: reminder of quotient, lambda[2]: quotient of quotient
    /// @param _mu mu of private key for decrypting votes. mu[0]: reminder of value, mu[1]: reminder of quotient, mu[2]: quotient of quotient
    function setPrivateKey(uint256[] memory _lambda, uint256[] memory _mu) public onlyOwner {
        if (isOpen()) revert ('Voting is now open.'); 
        lambda = BigInteger1024(_lambda[0], _lambda[1], _lambda[2], _lambda[3]);
        mu = BigInteger1024(_mu[0], _mu[1], _mu[2], _mu[3]);
        emit newBigInteger1024('set lambda', _lambda[0], _lambda[1], _lambda[2], _lambda[3]);
        emit newBigInteger1024('set mu', _mu[0], _mu[1], _mu[2], _mu[3]);
    }

    function getPrivateKey() public view returns (uint256[8] memory) {
        if (isOpen()) revert ('Voting is now open.');
        if (lambda.x1 == 0 && lambda.x256 == 0 && lambda.x512 == 0 && lambda.x768 == 0) revert ('No private key uploaded yet.');
        return [lambda.x1, lambda.x256, lambda.x512, lambda.x768, mu.x1, mu.x256, mu.x512, mu.x768];
    }

    /// ============ Helper Functions ============

    /// @param _emails List of email addresses to be added to whiteEmailAddresses
    function addWhiteEmailAddresses(bytes32[] memory _emails) public onlyOwner {
        for(uint i = 0; i < _emails.length; i++) {
            ballot.whiteEmailAddresses.push(_emails[i]);
        }
    }

    function addWhiteDomains(bytes32[] memory _domains) public onlyOwner {
        for(uint i = 0; i < _domains.length; i++) {
            ballot.whiteDomains.push(_domains[i]);
        }
    }

    function validBallotId(uint64 ballotId) public view returns (bool) {
        if (ballotId == ballot.ballotId) return true;
        else return false;
    }

    // 設定したタイムリミットに超えているかをチェックする : 現在のブロックに記録されているタイムスタンプで判断(block.timestamp 単位:seconds) https://zoom-blc.com/solidity-time-logic
    // タイムリミットを超えていた場合: false
    // タイムリミットを超えていない場合: true
    function isOpen() public view returns (bool) {
        if (block.timestamp >= ballot.timeLimit) return false;
        else return true;
    }

    function reachMaxVote() public view returns (bool) {
        if (voters.voteCounts[msg.sender] == ballot.voteLimit) return false;
        else return true;
    }

    function usingWhiteEmailAddress() public view returns (bool) {
        if (ballot.whiteListType == 1) return true;
        else return false;
    }

    function usingWhiteDomain() public view returns (bool) {
        if (ballot.whiteListType == 2) return true;
        else return false;
    }

    function whiteEmailAddressesIncludes(bytes32 _email) public view returns (bool) {
        for(uint j = 0; j < ballot.whiteEmailAddresses.length; j++) {
            if (ballot.whiteEmailAddresses[j] == _email) {
                return true;
            }
        }
        return false;
    }

    function whiteDomainsIncludes(bytes32 _domain) public view returns (bool) {
        for(uint i = 0; i < ballot.whiteDomains.length; i++) {
            if (ballot.whiteDomains[i] == _domain) {
                return true;
            }
        }
        return false;
    }

    function getTimelimit() public view returns (uint32) {
        return ballot.timeLimit;
    }

    function getTitle() public view returns (string memory) {
        return ballot.title;
    }

    function getAddress()public view returns (address) {
        return address(this);
    }

        function getWhiteDomains() public view returns (bytes32[] memory){
        return ballot.whiteDomains;
    }

    function getWhiteEmailAddresses() public view returns (bytes32[] memory){
        return ballot.whiteEmailAddresses;
    }

    function getWhitelistType() public view returns (uint8){
        return ballot.whiteListType;
    }

    function getId()public view returns (uint16){
        return voters.ids[msg.sender];
    }

    function getEmail()public view returns (bytes32){
        return voters.emails[msg.sender];
    }

    /// ============ Debug ============

    BigInteger2048 debugNumber = BigInteger2048(1, 0, 0, 0, 0, 0, 0, 0);

    function setPublicKey(uint256[] memory _n, uint256[] memory _g) public onlyOwner {
        n = BigInteger1024(_n[0], _n[1], _n[2], _n[3]);
        g = BigInteger2048(_g[0], _g[1], _g[2], _g[3], _g[4], _g[5], _g[6], _g[7]);
        emit newBigInteger1024('set n', _n[0], _n[1], _n[2], _n[3]);
        emit newBigInteger2048('set g', _g[0], _g[1], _g[2], _g[3], _g[4], _g[5], _g[6], _g[7]);
    }

    function setNumber (uint256[] memory values_) public {
        debugNumber = BigInteger2048(values_[0], values_[1], values_[2], values_[3], values_[4], values_[5], values_[6], values_[7]);
        emit newBigInteger2048('set debugNumber', values_[0], values_[1], values_[2], values_[3], values_[4], values_[5], values_[6], values_[7]);
    }

    function getNumber () public view returns (uint256[8] memory){
        return [debugNumber.x1, debugNumber.x256, debugNumber.x512, debugNumber.x768, debugNumber.x1024, debugNumber.x1280, debugNumber.x1536, debugNumber.x1792];
    }

}
