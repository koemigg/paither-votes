pragma solidity ^0.5.1;

contract Voting {

    event Bool(bool judge);
    event VotesCounts(uint256 _votesReceived);
    
    // 投票用紙情報
    struct Ballot {
        uint8 ballotType;   // 投票用紙の形式? election(選択式) or poll(記述式)
        uint32 ballotId;    // 特定のVotingコントラクトにアクセスするための値
        uint8 voteLimit;    // 投票回数
        uint32 timeLimit;   // 投票期間
        string title;       // タイトル
        uint8 whiteListType;                        // 投票に個別なEmailアドレスのホワイトリストの形式
        bytes32[] whiteEmailAddresses;              // 投票に個別なEmailアドレスのホワイトリスト
        bytes32[] whiteDomains;                     // 投票に個別なEmailアドレスのドメインのホワイトリスト
    }

    // 候補者情報をまとめた構造体
    struct Candidates {
        bytes32[] candidateList;    // 候補者リストを配列で保存
        // bytes3型の候補者名とstring型の候補者名のハッシュ値の対応付け: candidateHash[candidateList[i]] => keccak256[string型の候補者名]
        mapping (bytes32 => bytes32) candidateHash;
        mapping (bytes32 => uint256) votesReceived; // 候補者のハッシュ値と
    }

    // 投票者情報をまとめた構造体
    struct Voter {
        mapping (address => uint8) attemptedVotes;  // 各アドレスに対応する投票者の現在の投票回数
        mapping (bytes32 => address) voterAddr;     // Emailアドレスに対応するEthreumアドレス
        mapping (bytes32 => uint16) voterID;        // Emailアドレスに対応する学生/従業員ID番号を保存
        mapping (uint16 => bytes32) voterEmail;     // 学生/従業員ID番号に対応するEmailアドレスを保存
    }

    Candidates c;   // 候補者情報をまとめた構造体
    Voter v;        // 投票者情報をまとめた構造体
    Ballot b;       // 投票用紙情報をまとめた構造体

    string convertCandidate;    // bytes32型で保存されている候補者名をstring型に変換したもの
    string tempTitle;           // titleを一時格納
    bytes32 tempCandidate;      // 候補者を一時格納
    uint256 tempVote;           // votesReceivedに格納されている値を一時格納
    bytes32 tempHash;           // ハッシュ値を一時格納
    uint256[] tempVotes;        // votesReceivedを一時格納
    bytes32[] tempCandidates;   // 候補者リストを一時格納
    bytes32 tempEmail;          // メールアドレス格納
    address owner;              // 管理者のアドレス

    // uint32 _timeLimit  : 投票期間
    // uint8  _ballotType : 投票用紙の形式 election(選択式) or poll(記述式)
    // uint8  _voteLimit  : 投票回数
    // uint32 _ballotId   : 特定のVotingコントラクトにアクセスするための値
    // stting _title      : タイトル
    // uint8 _whiteListType : ホワイトリストのタイプ
    // address _owner     : 管理者のアドレス
    constructor
    (uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType, address _owner)
    public {
        // 投票用紙情報をまとめている構造体bに各パラメータを設定
        b.timeLimit = _timeLimit;
        b.ballotType = _ballotType;
        b.voteLimit = _voteLimit;
        b.ballotId = _ballotId;
        b.title = _title;
        b.whiteListType = _whiteListType;

        owner = _owner; // 管理者のアドレスを格納
    }


    modifier onlyOwner {
        require(msg.sender == owner, "Sender not authorized.");
        _;
    }

    // 候補者リストの設定
    // bytes32[] _candidates : 候補者リスト
    function setCandidate(bytes32[] memory _candidates) public onlyOwner {
        for(uint i = 0; i < _candidates.length; i++) {
            tempCandidate = _candidates[i]; // i番目の候補者を一時保存
            c.candidateList.push(tempCandidate);    // 候補者情報をまとめた構造体cのメンバ変数candidateListにtempCandidateを追加
        }
    }

    // whiteEmailAddressesの設定
    // bytes32[] _emails      : whiteEmailAddressesに追加したいメールアドレスリスト
    function setWhiteEmailAddress(bytes32[] memory _emails) public onlyOwner {
        for(uint i = 0; i < _emails.length; i++) {
            b.whiteEmailAddresses.push(_emails[i]);  // 投票者情報をまとめた構造体vのメンバ変数whiteEmailAddressesにtempEmailを追加
        }
    }

    function setWhiteDomain(bytes32[] memory _domain) public onlyOwner {
        for(uint i = 0; i < _domain.length; i++) {
            b.whiteDomains.push(_domain[i]);
        }
    }

    // 候補者リストに格納されている候補者名をハッシュ化していく
    function hashCandidates() public onlyOwner {
        tempVote = 1;   // 初期値
        for(uint i = 0; i < c.candidateList.length; i++) {
            tempCandidate = c.candidateList[i]; // 候補者情報をまとめた構造体cのメンバ変数candidateListのi番目の値を一時保存
            convertCandidate = bytes32ToString(tempCandidate);  // tempCandidateに格納されている候補者名をstring型に変換する
            c.candidateHash[tempCandidate] = keccak256(abi.encode(convertCandidate));   // bytes32の候補者名とstring型の候補者名をkeccak256でハッシュ化したものの対応付け
            c.votesReceived[keccak256(abi.encode(convertCandidate))] = tempVote;    // 候補者名をkeccak256でハッシュ化したものと, tempVote = 1を対応付け
        }
    }

    // uint256[] _votes : 投票内容
    // bytes32[] _candidates : 投票者が使用した候補者リスト
    // bytes32 _email : 投票するユーザーのメールアドレス
    function voteForCandidate(uint256[] memory _votes, bytes32 _email, bytes32 _domain, bytes32[] memory _candidates) public {
        if (checkTimelimit() == false) revert('The time for voting has passed.');
        if (checkVoteattempts() == false) revert('Maximum number of votes has been reached.');
        if (usingWhiteEmailAddress() == true && whiteEmailAddressesIncludes(_email) == false) revert('Email address is not whitelistted.');
        if (usingWhiteDomain() == true && whiteDomainsIncludes(_domain) == false) revert('Domain is not whitelisted.');
        tempVotes = _votes;
        tempCandidates = _candidates;       // 候補者リストを一時保存
        v.attemptedVotes[msg.sender] += 1;  // このメソッドを呼び出したユーザ(投票した人)の投票回数を+1する

        for(uint i = 0; i < tempCandidates.length; i++) {
            tempCandidate = tempCandidates[i];
            tempHash = c.candidateHash[tempCandidate]; // 候補者名のハッシュ値を格納
            if (validCandidate(tempHash) == false) revert('This is a non-existent option/candidate name.');
            tempVote = tempVotes[i];
            c.votesReceived[tempHash] = tempVote;   // 候補者に対応する投票結果を保存
        }
    }

    // 入力bytes32 cHashに対応するvotesReceived(途中結果の投票数?)を出力する
    function votesFor(bytes32 cHash) public view returns (uint256){
        if (validCandidate(cHash) == false) revert('This is a non-existent option/candidate name.');
        // emit VotesCounts(c.votesReceived[cHash]);
        return c.votesReceived[cHash];
    }

    // 入力bytes32 cHashに対応するvotesReceived(集計結果?)を出力する
    function totalVotesFor(bytes32 cHash) public view returns (uint256){
        if (checkBallottype() == false && checkTimelimit() == true){
            // emit VotesCounts(0);
            return 0;   // 投票期間中で,
        }
        if (validCandidate(cHash) == false) revert('This is a non-existent option/candidate name.');
        // emit VotesCounts(c.votesReceived[cHash]);
        return c.votesReceived[cHash];
    }

    function registerVoter(bytes32 _email, uint16 _idnum, bytes32 _domain) public {
        if (usingWhiteEmailAddress() == true && whiteEmailAddressesIncludes(_email) == false) revert('Email address is not whitelisted.');
        if (usingWhiteDomain() == true && whiteDomainsIncludes(_domain) == false) revert('Domain is not whitlisted.');
        v.voterID[_email] = _idnum;           // 入力されたEmailアドレスと学生/従業員ID番号を対応付け
        v.voterAddr[_email] = msg.sender;    // 入力されたEmailアドレスEtherumアカウントアドレスの対応付け
        v.voterEmail[_idnum] = _email;        // 入力された学生/従業員ID番号とEmailアドレスの対応付け
    }

    function addWhiteDomain(bytes32 _domain) public onlyOwner {
        b.whiteDomains.push(_domain);
    }

    // このメソッドを呼び出したユーザーが登録済みか否かを確認する
    // 未登録であればtrue, 登録済みであればfalse
    // bytes32 email : メールアドレス
    // uint16 idnum  : 学生/従業員ID番号
    function checkReg(bytes32 _email, uint16 _idnum) public view returns (bool) {
        if (v.voterID[_email] == 0 && v.voterEmail[_idnum] == 0) return true;
        else return false;
    }

    // このメソッドを呼び出した投票者の状態を確認する
    // bytes32 email : メールアドレス
    function checkVoter(bytes32 email) public view returns (uint8) {
        if (v.voterID[email] == 0) return 1;            // 登録処理が行われていない場合1を返す
        // メールアドレスに紐付いているEthreumアカウントアドレスとメソッドを呼び出した投票者のEthereumアカウントアドレスが一致しなければ2を返す
        if (v.voterAddr[email] != msg.sender) return 2;
        else return 0;  // 他の状態であれば0を返す
    }

    // 投票用紙IDとそれに対応するVotingコントラクトのアドレスをリンクする
    // address _ballotAddr : Votingコントラクトのアドレス
    // uint32 _ballotID    : 投票用紙ID
    function setAddress(address _ballotAddr, uint32 _ballotID) public {
        b.votingAddress[_ballotID] = _ballotAddr;   // 投票用紙IDにVotingコントラクトアドレスを紐付ける
        b.ballotID[_ballotAddr] = _ballotID;        // Votingコントラクトアドレスに投票用紙IDを紐付ける
    }

    // 入力値の投票用紙IDに紐付いているコントラクトアドレスを出力
    function getAddress(uint32 _ballotID) public view returns (address) {
        return b.votingAddress[_ballotID];
    }

    // 入力値bytes32 xをstring型に変換
    function bytes32ToString(bytes32 x) public pure returns (string memory) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (uint j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    // 入力bytes32 cHash(候補者名のハッシュ値)が全候補者名のハッシュリストcandidateListの中に一致するものがあればtrue, なければfalse
    function validCandidate(bytes32 cHash) public view returns (bool) {
        for(uint k = 0; k < c.candidateList.length; k++) {
            // tempCandidate = c.candidateList[k];
            if (c.candidateHash[c.candidateList[k]] == cHash) {
                // emit Bool(true);
                return true;
            }
        }
        // emit Bool(false);
        return false;
    }

    // 設定されている候補者リストを出力する
    // uint64 _ballotID : 投票用紙ID
    function getCandidateList(uint64 _ballotID) public view returns (bytes32[] memory) {
        if (checkballotID(_ballotID) == false) revert('BallotID does not match');
        return c.candidateList;
    }

    // 設定したタイムリミットに超えているかをチェックする : 現在のブロックに記録されているタイムスタンプで判断(block.timestamp 単位:seconds) https://zoom-blc.com/solidity-time-logic
    // タイムリミットを超えていた場合: false
    // タイムリミットを超えていない場合: true
    function checkTimelimit() public view returns (bool) {
        if (block.timestamp >= b.timeLimit) return false;
        else return true;
    }

    // 設定したballotTypeをチェックする.
    function checkBallottype() public view returns (bool) {
        if (b.ballotType == 1) return false;
        else return true;
    }

    // 入力された投票用紙IDと最初に設定した投票用紙IDが一致するかをチェックする.
    // 一致すればtrue, しなければfalse
    function checkballotID(uint64 ballotID) public view returns (bool) {
        if (ballotID == b.ballotId) return true;
        else return false;
    }

    // このメソッドを呼び出したユーザーが, 投票回数の上限に達しているかをチェックする.
    // 達していなければtrue, 達していればfalse
    function checkVoteattempts() public view returns (bool) {
        if (v.attemptedVotes[msg.sender] == b.voteLimit) return false;
        else return true;
    }

    // whiletelistに格納されている値が1であればtrue, 1でなければfalse
    function usingWhiteEmailAddress() public view returns (bool) {
        if (b.whiteListType == 1) return true;
        else return false;
    }

    function usingWhiteDomain() public view returns (bool) {
        if (b.whiteListType == 1) return true;
        else return false;
    }

    // 入力値bytes32 emailが, whiteEmailAddressesに登録されているかをチェックする.
    // 登録されていればtrue, されていなければfalse
    function whiteEmailAddressesIncludes(bytes32 email) public view returns (bool) {
        for(uint j = 0; j < b.whiteEmailAddresses.length; j++) {
            if ( b.whiteEmailAddresses[j] == email) {
                return true;
            }
        }
        return false;
    }

    function whiteDomainsIncludes(bytes32 _domain) public view returns (bool) {
        for(uint i = 0; i < b.whiteDomains.length; i++) {
            if ( b.whiteDomains[i] == _domain) {
                return true;
            }
        }
        return false;
    }

    // 設定されているタイムリミットを出力する
    function getTimelimit() public view returns (uint32) {
        return b.timeLimit;
    }

    // 設定されているタイトルを出力する
    function getTitle() public view returns (string memory) {
        return b.title;
    }
}

//                         //
//Start of Creator contract//
//                         //

contract Creator {

    event newVotingContractEvent(
       address contractAddress
    );

    mapping (uint32 => address) votes;      // Ballot ID => Voting conract address
    mapping (address => uint32) ballotIDs;  // Voting conract address => Ballot ID 
    
    address owner;

    function createBallot(uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whiteListType)
    public {
        Voting newVoting = new Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whiteListType, msg.sender);
        votes[_ballotId] = address(newVoting);
        ballotIDs[address(newVoting)] = _ballotId;
        emit newVotingContractEvent(address(newVoting));
    }

    function getAddress(uint32 _ballotId) public view returns(Voting contractAddress) {
        return votes[_ballotId];
    }
}
