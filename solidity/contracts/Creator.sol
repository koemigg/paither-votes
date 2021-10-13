pragma solidity ^0.5.1;

contract Voting {

    event Bool(bool judge);
    event VotesCounts(uint256 _votesReceived);
    // 投票用紙情報をまとめた構造体
    struct Ballot {
        uint8 ballotType;   // 投票用紙の形式? election(選択式) or poll(記述式)
        uint32 ballotId;    // 特定のVotingコントラクトにアクセスするための値
        uint8 voteLimit;    // 投票回数
        uint32 timeLimit;   // 投票期間
        string title;       // タイトル
        uint8 whitelist;    // 投票に個別なEmailアドレスのホワイトリストの形式
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
        bytes32[] whitelisted;                      // 投票に個別なEmailアドレスのホワイトリスト
        bytes32[] whiteDomains;                     // 投票に個別なEmailアドレスのドメインのホワイトリスト
        mapping (address => uint8) attemptedVotes;  // 各アドレスに対応する投票者の現在の投票回数
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

    // コンストラクタ
    // uint32 _timeLimit  : 投票期間?
    // uint8  _ballotType : 投票用紙の形式? election(選択式) or poll(記述式)
    // uint8  _voteLimit  : 投票回数?
    // uint32 _ballotId   : 特定のVotingコントラクトにアクセスするための値
    // stting _title      : タイトル
    // uint8 _whitelisted : 投票に個別なEmailアドレスのホワイトリスト
    // address _owner     : 管理者のアドレス
    constructor
    (uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whitelist, address _owner)
    public {
        // 投票用紙情報をまとめている構造体bに各パラメータを設定
        b.timeLimit = _timeLimit;
        b.ballotType = _ballotType;
        b.voteLimit = _voteLimit;
        b.ballotId = _ballotId;
        b.title = _title;
        b.whitelist = _whitelist;

        owner = _owner; // 管理者のアドレスを格納
    }

    // modifier処理を設定
    // このmodifierがついたメソッドを呼び出したユーザーが管理者アドレスと一致するかを確認する.
    // 一致すれば処理を続行, 一致しなければ処理をその時点で終了し, contractの状態を実行前に戻す
    modifier onlyOwner {
        require(msg.sender == owner, "Sender not authorized.");
        _;
    }

    // 候補者リストの設定を行う : 管理者のみ実行可能
    // bytes32[] _candidates : 候補者リスト
    function setCandidates(bytes32[] memory _candidates) public onlyOwner {
        for(uint i = 0; i < _candidates.length; i++) {
            tempCandidate = _candidates[i]; // i番目の候補者を一時保存
            c.candidateList.push(tempCandidate);    // 候補者情報をまとめた構造体cのメンバ変数candidateListにtempCandidateを追加
        }
    }

    // whitelistedの設定を行う : 管理者のみ実行可能
    // bytes32[] _emails      : whitelistedに追加したいメールアドレスリスト
    function setWhitelisted(bytes32[] memory _emails) public onlyOwner {
        for(uint i = 0; i < _emails.length; i++) {
            tempEmail = _emails[i]; // i番目のメールアドレスを一時保存
            v.whitelisted.push(tempEmail);  // 投票者情報をまとめた構造体vのメンバ変数whitelistedにtempEmailを追加
        }
    }

    function setWhiteListedDomain(bytes32[] memory _domain) public onlyOwner {
        for(uint i = 0; i < _domain.length; i++) {
            v.whiteDomains.push(_domain[i]);
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

    // uint256[] _votes : 投票内容?
    // bytes32[] _candidates : 投票者が使用した候補者リスト
    // bytes32 _email : 投票するユーザーのメールアドレス
    function voteForCandidate(uint256[] memory _votes, bytes32 _email, bytes32 _domain, bytes32[] memory _candidates) public {
        // 投票回数の上限に達しているか
        if (checkTimelimit() == false || checkVoteattempts() == false) revert('Maximum number of votes has been reached.');
        // Emailアドレスがホワイトリストに含まれているか
        if (checkWhitelist() == true && checkifWhitelisted(_email) == false) revert('Email address is not included in the whitelist');
        // Emailアドレスのドメインがホワイトリストに含まれているか
        if (usingWhiteDomain() == true && whiteDomainIncludes(_domain) == false) revert('Domain is not included in the whitelist');
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
    function candidateList(uint64 _ballotID) public view returns (bytes32[] memory) {
        if (checkballotID(_ballotID) == false) revert('BallotID does not match.');
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
    function checkWhitelist() public view returns (bool) {
        if (b.whitelist == 1) return true;
        else return false;
    }

    function usingWhiteDomain() public view returns (bool) {
        if (b.whitelist == 1) return true;
        else return false;
    }

    // 入力値bytes32 emailが, whitelistedに登録されているかをチェックする.
    // 登録されていればtrue, されていなければfalse
    function checkifWhitelisted(bytes32 email) public view returns (bool) {
        for(uint j = 0; j < v.whitelisted.length; j++) {
            if ( v.whitelisted[j] == email) {
                return true;
            }
        }
        return false;
    }

    function whiteDomainIncludes(bytes32 _domain) public view returns (bool) {
        for(uint i = 0; i < v.whiteDomains.length; i++) {
            if ( v.whiteDomains[i] == _domain) {
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

    mapping (uint32 => Voting) contracts;  // Votingコントラクトのアドレスを登録. contracts[投票用紙ID(uint32)] => アドレスにアクセス
    address owner;                          // 管理者のアドレス

    // Votingコントラクトの設定パラメータを入力して作成, contractsに格納するメソッド
    // uint32 _timeLimit  : 投票期間?
    // uint8  _ballotType : 投票用紙の形式?  election(選択式)1 or poll(記述式)0
    // uint8  _voteLimit  : 投票回数?
    // uint32 _ballotId   : 特定のVotingコントラクトにアクセスするための値
    // string _title      : タイトル
    // uint8 _whitelisted : 投票ごとのホワイトリストの形式
    function createBallot(uint32 _timeLimit, uint8 _ballotType, uint8 _voteLimit, uint32 _ballotId, string memory _title, uint8 _whitelist)
    public {
        owner = msg.sender;     // このメソッドを呼び出したアカウントのアドレスを格納
        Voting newContract = new Voting(_timeLimit, _ballotType, _voteLimit, _ballotId, _title, _whitelist, owner);
        contracts[_ballotId] = newContract; // 作成したVotingコントラクトのアドレスを登録
        emit newVotingContractEvent(address(newContract));
    }

    // 入力したidに対応したcontractsに格納されているVotingコントラクトアドレスを出力
    function getAddress(uint32 id) public view returns(Voting contractAddress) {
        return contracts[id];
    }
}
