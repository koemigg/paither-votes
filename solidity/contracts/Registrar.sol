// SPDX-License-Identifier: MIT
pragma solidity ^0.5.1;

contract Registrar {

    // 投票者情報をまとめた構造体
    struct Voter {
        bytes32[] allowedDomains;   // ドメインリスト(ホワイトリスト)
        mapping (bytes32 => address) voterAddr; // e-mailアドレスに対応するEthreumアドレスを保存
        mapping (bytes32 => uint8) createPerm;  // e-mailアドレスに対応する権限?を保存
        mapping (bytes32 => uint16) voterID;    // e-mailアドレスに対応する学生/従業員ID番号を保存
        mapping (uint16 => bytes32) voterEmail; // 学生/従業員ID番号を保存
    }   

    // 投票用紙情報をまとめた構造体
    struct Ballot {
        mapping (uint32 => address) votingAddress;  // 投票用紙IDに対応するvotingコントラクトアドレスを保存
        mapping (address => uint32) ballotID;       // votinコントラクトアドレスに対応する投票用紙IDを保存
        mapping (uint64 => uint8) whitelistCheck;
        mapping (bytes32 => uint8) allowedVoters;
    }

    Voter v;    
    Ballot b;
    address owner;  // 管理者のアドレス

    // コンストラクタ: コントラクトを作成する際に実行される
    // ドメインリストを格納し, コントラクトを作成したノードのアドレスを保存
    constructor (bytes32[] memory domainList) public {
        v.allowedDomains = domainList;  // 入力されたドメインリストを保存
        owner = msg.sender;
    }

    // modifier処理を設定
    // このmodifierがついたメソッドを呼び出したユーザーが管理者アドレスと一致するかを確認する. 
    // 一致すれば処理を続行, 一致しなければ処理をその時点で終了し, contractの状態を実行前に戻す
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // 投票者の登録
    // bytes32 email   : ユーザーのメールアドレス
    // uint16 idnum    : 学生/従業員ID番号
    // bytes32 _domain : ドメイン名
    // uint8   _permreq: 権限?
    function registerVoter(bytes32 email, uint16 idnum, bytes32 _domain, uint8 _permreq) public {
        if (domainCheck(_domain) == false) revert();    // 入力されたドメイン名がdomainListに登録されていなければ処理を終了する
        v.voterID[email] = idnum;           // 入力されたe-mailアドレスと学生/従業員ID番号を対応付け
        v.createPerm[email] = _permreq;     // 入力されたe-mailアドレスと権限?を対応付け
        v.voterAddr[email] = msg.sender;    // 入力されたe-mailアドレスEtherumアカウントアドレスを対応付け
        v.voterEmail[idnum] = email;        // 入力された学生/従業員ID番号とe-mailアドレスを対応付け
    }

    // 入力されたメールアドレスに権限1を設定する
    function givePermission(bytes32 email) public onlyOwner {
        v.createPerm[email] = 1;
    }

    // 入力されたドメインをallowedDomains(ホワイトリスト)に追加する
    function addDomains(bytes32 _domain) public onlyOwner {
        v.allowedDomains.push(_domain);
    }

    // 入力bytes32 domainがallowedDomains(ドメインに関するホワイトリスト)に登録されているかをチェックする
    // 登録されていればtrue
    // 登録されていなければfalse
    function domainCheck(bytes32 domain) public view returns (bool) {
        for(uint i = 0; i < v.allowedDomains.length; i++) {
            if (v.allowedDomains[i] == domain) {
                return true;
            }
        }
        return false;
    }

    // このメソッドを呼び出したユーザーが登録済みか否かを確認する
    // 未登録であればtrue, 登録済みであればfalse
    // bytes32 email : メールアドレス
    // uint16 idnum  : 学生/従業員ID番号
    function checkReg(bytes32 email, uint16 idnum) public view returns (bool) {
        if (v.voterID[email] == 0 && v.voterEmail[idnum] == 0) return true;
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

    // 入力値の_emailアドレスに対応する権限を返す
    function getPermission(bytes32 _email) public view returns (uint8) {
        return v.createPerm[_email];
    }
}