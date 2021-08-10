// Copy of VotingApp1.js

/*globals $*/
/*globals Web3*/
/*globals web3*/
/*globals ethers*/
/*globals StringToBytes*/
/*globals scientificToDecimal*/

var creatorABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint32',
        name: '_timeLimit',
        type: 'uint32',
      },
      {
        internalType: 'uint8',
        name: '_ballotType',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_voteLimit',
        type: 'uint8',
      },
      {
        internalType: 'uint32',
        name: '_ballotId',
        type: 'uint32',
      },
      {
        internalType: 'string',
        name: '_title',
        type: 'string',
      },
      {
        internalType: 'uint8',
        name: '_whitelisted',
        type: 'uint8',
      },
    ],
    name: 'createBallot',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint32',
        name: 'id',
        type: 'uint32',
      },
    ],
    name: 'getAddress',
    outputs: [
      {
        internalType: 'contract Voting',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

var registrarABI = [
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'domainList',
        type: 'bytes32[]',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'email',
        type: 'bytes32',
      },
      {
        internalType: 'uint16',
        name: 'idnum',
        type: 'uint16',
      },
      {
        internalType: 'bytes32',
        name: '_domain',
        type: 'bytes32',
      },
      {
        internalType: 'uint8',
        name: '_permreq',
        type: 'uint8',
      },
    ],
    name: 'registerVoter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'email',
        type: 'bytes32',
      },
    ],
    name: 'givePermission',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_domain',
        type: 'bytes32',
      },
    ],
    name: 'addDomains',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'domain',
        type: 'bytes32',
      },
    ],
    name: 'domainCheck',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'email',
        type: 'bytes32',
      },
      {
        internalType: 'uint16',
        name: 'idnum',
        type: 'uint16',
      },
    ],
    name: 'checkReg',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'email',
        type: 'bytes32',
      },
    ],
    name: 'checkVoter',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_ballotAddr',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: '_ballotID',
        type: 'uint32',
      },
    ],
    name: 'setAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint32',
        name: '_ballotID',
        type: 'uint32',
      },
    ],
    name: 'getAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_email',
        type: 'bytes32',
      },
    ],
    name: 'getPermission',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

var votingABI = [
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '_timeLimit',
        type: 'uint32',
      },
      {
        internalType: 'uint8',
        name: '_ballotType',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_voteLimit',
        type: 'uint8',
      },
      {
        internalType: 'uint32',
        name: '_ballotId',
        type: 'uint32',
      },
      {
        internalType: 'string',
        name: '_title',
        type: 'string',
      },
      {
        internalType: 'uint8',
        name: '_whitelist',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'judge',
        type: 'bool',
      },
    ],
    name: 'Bool',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_votesReceived',
        type: 'uint256',
      },
    ],
    name: 'VotesCounts',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32[]',
        name: '_candidates',
        type: 'bytes32[]',
      },
    ],
    name: 'setCandidates',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32[]',
        name: '_emails',
        type: 'bytes32[]',
      },
    ],
    name: 'setWhitelisted',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'hashCandidates',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_votes',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes32',
        name: '_email',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_candidates',
        type: 'bytes32[]',
      },
    ],
    name: 'voteForCandidate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'cHash',
        type: 'bytes32',
      },
    ],
    name: 'votesFor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'cHash',
        type: 'bytes32',
      },
    ],
    name: 'totalVotesFor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'x',
        type: 'bytes32',
      },
    ],
    name: 'bytes32ToString',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'cHash',
        type: 'bytes32',
      },
    ],
    name: 'validCandidate',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint64',
        name: '_ballotID',
        type: 'uint64',
      },
    ],
    name: 'candidateList',
    outputs: [
      {
        internalType: 'bytes32[]',
        name: '',
        type: 'bytes32[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'checkTimelimit',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'checkBallottype',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint64',
        name: 'ballotID',
        type: 'uint64',
      },
    ],
    name: 'checkballotID',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'checkVoteattempts',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'checkWhitelist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'email',
        type: 'bytes32',
      },
    ],
    name: 'checkifWhitelisted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getTimelimit',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getTitle',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const creatorAddress = '0x9Cd24f911A25831569B092cAaA5837D22F6d27A8';
const registrarAddress = '0x14aFC2dcE0f16c4ffbC4675Cd36e5d376c3Ab018';

let ethersProvider;
let signer;

let creatorContract;
let registrarContract;

var input1 = 1;
var input2 = 0;

var ballotID; // 投票用紙ID

let candidates = {}; // 候補者

var strTobyterser = new StringToBytes();

window.onload = function () {
  // メタマスクがインストールされているかのチェック
  if (typeof web3 !== 'undefined') {
    console.log('MetaMaskインストール済み');
    web3 = new Web3(web3.currentProvider);
    console.log('Web3 version: ', web3.version.api);

    // Init Contracts.
    ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('ethersProvider', ethersProvider);
    signer = ethersProvider.getSigner();
    console.log('signer', signer);

    creatorContract = new ethers.Contract(creatorAddress, creatorABI, signer);
    registrarContract = new ethers.Contract(registrarAddress, registrarABI, signer);
  } else {
    alert('MetaMaskをインストールして下さい．');
  }

  // メタマスクのアドレスを取得する
  web3.eth.getAccounts(function (err, accounts) {
    console.log('MetaMask起動済み');
    let coinbase = accounts[0];
    console.log('coinbase is ' + coinbase);
    if (typeof coinbase === 'undefined') {
      alert('MetaMaskを起動してください．');
    }
  });
};

window.loadBallot = function () {
  $('#candidate-rows tr').remove(); // 該当テーブルの要素を削除
  ballotID = $('#ballotid').val(); // 該当idの値を取得
  candidates = {}; // 候補者リストの初期化

  creatorContract
    .getAddress(ballotID)
    .then(function (result) {
      let votingAddress = result.toString();
      if (votingAddress == 0) {
        window.alert('Invalid ballot ID');
        throw new Error('Invalid ballot ID.');
      } else {
        // コントラクトアドレスが設定済み
        $('#msg4').html('Setting up the ballot...');
        // 投票用紙とコントラクトアドレスから, 候補者名等の選挙情報をwebページに表示する関数
        getCandidates(votingAddress, ballotID);
        console.log('votingAddress: ', votingAddress);
      }
    })
    .catch(function (error) {
      console.error('投票の読み込みに失敗しました');
      console.error(error);
    });
};

window.registerToVote = async function () {
  let idNumber = $('#idnum').val();
  let email = $('#email').val();
  let permreq = $('input[name=permreq]:checked').val(); // checkされているかを取得

  if (permreq != 1) {
    permreq = 0;
  }

  var emailToBytes = strTobyterser.StringToBytes32(email);
  var domain = strTobyterser.StringToBytes32(email.replace(/.*@/, '')); // ドメイン部分だけを格納

  // メールアドレスのドメインがホワイトリストに登録されているかチェック
  try {
    let value = await registrarContract.domainCheck(domain);
    let domainValid = value.toString();

    if (domainValid == 'false') {
      window.alert(email + ' is Invalid E-mail address.');
      throw new Error('メールアドレスがホワイトリストに登録されていません');
    }

    // ユーザが既に登録済みかチェック
    value = await registrarContract.checkReg(emailToBytes, idNumber);
    var emailValid = value.toString();

    if (emailValid == 'false') {
      // 既に登録済みであればエラーを表示
      window.alert('E-mail/ID Number already registered to vote!');
      throw new Error('既に有権者登録済みです');
    }

    $('#idnum').val(''); // id入力欄をリセット
    $('#email').val(''); // メールアドレス入力欄をリセット

    // コントラクトに投票者情報を登録
    let result = await registrarContract.registerVoter(emailToBytes, idNumber, domain, permreq);
    window.alert('Account ready to vote!');
    // window.alert("It took" + (performance.now() - t0) + "ms to finish");
    console.log('TX HASH:', result);

    $('#msg2').html('Registration attempt successful! Please wait for verification.');
  } catch (error) {
    console.error(error);
  }
};

window.voteForCandidate = function (candidate) {
  let candidateName = $('#candidate').val(); // 入力された候補者名を取得
  let email = $('#e-mail').val(); // 入力されたe-mailアドレスを取得
  var emailToBytes = strTobyterser.StringToBytes32(email);
  $('#msg2').html(''); // 該当場所のメッセージを初期化
  $('#msg4').html('');

  var domain = email.replace(/.*@/, ''); // e-mailのドメイン部分を格納
  domain = strTobyterser.StringToBytes32(domain);

  var encodeName = strTobyterser.AbiEncode(candidateName);
  var cHash = ethers.utils.keccak256(encodeName); // 候補者名を32bitサイズでハッシュ化

  var votesArray = [];

  registrarContract.checkVoter(emailToBytes, (error, v) => {
    var voterCheck = v.toString();

    if (voterCheck == 1) {
      // 未登録であればエラーを表示
      window.alert('E-mail address not registered!');
      //$("#msg").html("E-mail address not registered!")
      throw new Error();
    } else if (voterCheck == 2) {
      // メールアドレスとコントラクトアドレスが適合していなければエラーを表示
      window.alert('E-mail address and Ethereum address mismatch!');
      //$("#msg").html("E-mail address and Ethereum address mismatch!")
      throw new Error();
    }

    creatorContract.getAddress(ballotID, (error, v) => {
      var votingAddress = v.toString();
      let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
      // var votingContract = web3.eth.contract(votingABI).at(votingAddress);
      votingContract.checkWhitelist((error, v) => {
        let wc1 = v.toString();
        // 投票者のメールアドレスがホワイトリストに登録されているかをチェック
        votingContract.checkifWhitelisted(emailToBytes, (error, v) => {
          let wc2 = v.toString();
          if (wc1 == 'true' && wc2 == 'false') {
            window.alert("You're are not authorized to vote on this ballot!");
            //$("#msg").html("You're are not authorized to vote on this ballot!")
            throw new Error();
          } else {
            // 投票した候補者名が今回の候補者リストに存在するかチェック
            votingContract.validCandidate(cHash, (error, v) => {
              var canValid = v.toString();

              if (canValid == 'false') {
                window.alert('Invalid Candidate!');
                //$("#msg").html("Invalid Candidate!")
                throw new Error();
              }

              // 投票回数の上限に達しているかをチェック
              votingContract.checkVoteattempts((error, v) => {
                var attempCheck = v.toString();

                if (attempCheck == 'false') {
                  window.alert('You have reached your voting limit for this ballot/poll!');
                  //$("#msg").html("You have reached your voting limit for this ballot/poll!")
                  throw new Error();
                }

                // 投票処理中メッセージを表示, 入力欄の初期化
                $('#msg').html(
                  'Your vote attempt has been submitted. Please wait for verification.'
                );
                $('#candidate').val('');
                $('#e-mail').val('');

                votingContract.candidateList(ballotID, (error, candidateArray) => {
                  for (let i = 0; i < candidateArray.length; i++) {
                    var hcand = web3.toUtf8(candidateArray[i]);
                    console.log('hcand=' + hcand);
                    var encodeName = strTobyterser.AbiEncode(hcand);
                    let hcHash = ethers.utils.keccak256(encodeName);

                    if (hcHash == cHash) {
                      encrypt(hcHash, input1, i, candidateArray, email, votingAddress, votesArray);
                    } else {
                      encrypt(hcHash, input2, i, candidateArray, email, votingAddress, votesArray);
                    }
                  }
                });
              });
            });
          }
        });
      });
    });
  });
};

function encrypt(hcHash, vnum, i, candidateArray, email, votingAddress, votesArray) {
  var einput1;
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/crypto/encrypt/' + vnum, // 投票文を暗号化
    success: function (eoutput1) {
      let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
      // var votingContract = web3.eth.contract(votingABI).at(votingAddress);
      votingContract.votesFor(hcHash, (error, v) => {
        var convVote = v;
        einput1 = convVote;
        console.log('einput1=' + einput1);
        einput1 = scientificToDecimal(einput1); // 10進数表記

        if (einput1 != 0) {
          // 集計結果が0でなければ, 今回の投票文を加算する
          add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray);
        }
        // var VotesCounts = votingContract.VotesCounts();
        //   VotesCounts.watch(function (error, result){
        //     var convVote = result.args._votesReceived.toString();
        //     einput1 = convVote; // 暗号化された集計結果を取得
        //     console.log("einput1="+einput1);
        //     einput1 = scientificToDecimal(einput1)  // 10進数表記

        //     if (einput1 != 0) { // 集計結果が0でなければ, 今回の投票文を加算する
        //       add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray)
        //     }
        // });
      });
    },
  });
}

function add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray) {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/crypto/add/' + eoutput1 + '/' + einput1, // 二つの暗号文を加算する
    success: function (eadd1) {
      // 加算結果をコントラクトに登録
      verifyTimestamp(eadd1, i, candidateArray, email, votingAddress, votesArray);
    },
  });
}

function verifyTimestamp(eadd1, i, candidateArray, email, votingAddress, votesArray) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
  // var votingContract = web3.eth.contract(votingABI).at(votingAddress);
  votingContract.checkTimelimit((error, v) => {
    var timecheck = v.toString();
    if (timecheck == 'false') {
      votingContract.getTimelimit((error, v) => {
        var endtime = v.toString(); // 制限時間の取得
        //Testnet is plus 7 hours, uncomment this line if testing on testnet
        //endtime = endtime - 21600
        endtime = new Date(endtime * 1000);
        getVotes(votingAddress); // 投票結果を表に表示
        //window.alert("Voting period for this ballot has ended on " +endtime)
        // 投票期限を過ぎた旨をメッセージで表示
        $('#msg').html('Voting period for this ballot has ended on ' + endtime);
        throw new Error();
      });
    } else {
      votesArray[i] = eadd1; // 該当場所に暗号化された投票内容を格納
      if (i == candidateArray.length - 1) {
        // 最後の候補者名まで処理がされていれば,以下の処理
        // 投票者の各候補者に対する投票内容をコントラクトに登録する
        vote(i, candidateArray, email, votingAddress, votesArray);
      }
    }
  });
}

function vote(i, candidateArray, email, votingAddress, votesArray) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
  // var votingContract = web3.eth.contract(votingABI).at(votingAddress);
  votingContract.voteForCandidate(votesArray, email, candidateArray, (error, v) => {
    getVotes(votingAddress); // 投票結果を表に表示
    $('#msg').html('');
    window.alert('Your vote has been verified!');
  });
}

window.ballotSetup = function () {
  let cemail = $('#cemail').val();
  let emailToBytes = strTobyterser.StringToBytes32(cemail);

  registrarContract
    .checkVoter(emailToBytes)
    .then(function (v) {
      var voterCheck = v.toString();

      if (voterCheck == 1) {
        window.alert('E-mail address not registered!');
        //$("#msg").html("E-mail address not registered!")
        throw new Error('E-mail address not registered');
      } else if (voterCheck == 2) {
        window.alert('E-mail address and Ethereum address mismatch!');
        //$("#msg").html("E-mail address and Ethereum address mismatch!")
        throw new Error('E-mail address and Ethereum address mismatch.');
      } else {
        registrarContract.getPermission(emailToBytes).then(function (v) {
          if (v.toString() == 0) {
            //$("#msg3").html("You are not authorized to create ballots! Please contact admin to request authorization.")
            window.alert(
              'You are not authorized to create ballots! Please contact admin to request authorization.'
            );
            throw new Error(cemail, " isn't authorized to create ballots.");
          } else {
            let date = $('#date').val();
            let enddate = Date.parse(date).getTime() / 1000;
            let time = $('#time').val();
            //Testnet is plus 7 hours
            //-21600 to get original end date and time on testnet
            let timeArray = time.split(':');
            //Testnet is plus 7 hours, uncomment this line if testing on testnet
            //var seconds = ((timeArray[0]*60)*60) + (timeArray[1]*60) + 21600
            let seconds = timeArray[0] * 60 * 60 + timeArray[1] * 60; // 秒数表示
            enddate += seconds; // 投票期限を取得
            let ballottype = $('input[name=ballottype]:checked').val(); // 投票形式を取得 poll or election
            let title = $('#vtitle').val(); // 投票タイトルを取得
            let choices = $('#choices').val(); // 候補者名一覧を取得
            let choicesArray = choices.split(/\s*,\s*/); // 候補社名をリストで取得
            let votelimit = $('#votelimit').val(); // 投票回数を取得
            let whitelist = $('input[name=whitelist]:checked').val(); // ホワイトリストの形式を取得
            let whitelisted = $('#whitelisted').val(); // ホワイトリストに登録したいメールアドレスを取得
            let whitelistedArray = whitelisted.split(/\s*,\s*/); // ホワイトリストをリスト形式で取得
            let ballotid = Math.floor(Math.random() * 4294967295); // 投票用紙IDをランダムで生成

            creatorContract
              .createBallot(enddate, ballottype, votelimit, ballotid, title, whitelist)
              .then(async function (result) {
                // Debug 210810
                await sleepByPromise(20);

                console.log('Ballot作成完了', '\nTX HASH: ', result);
                creatorContract
                  .getAddress(ballotid)
                  .then(function (v) {
                    console.log('VotingAddress: ', v);
                    let votingAddress = v.toString();
                    fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid);
                    registerBallot(votingAddress, ballotid);
                    console.log('Ballot作成完了');
                  })
                  .catch(function (error) {
                    console.error(error);
                    console.error('VotingAddressを取得できませんでした');
                  });
              })
              .catch(function (error) {
                console.error(error);
                console.error('Ballot作成失敗');
              });
          }
        });
      }
    })
    .catch(function (error) {
      console.error(error);
      console.error('有権者確認失敗');
    });
};

// window.ballotSetup = async function () {
//   try {
//     let cemail = $("#cemail").val();
//     let emailToBytes = strTobyterser.StringToBytes32(cemail);

//     let v = await registrarContract.checkVoter(emailToBytes);
//     var voterCheck = v.toString();

//     if (voterCheck == 1) {
//       window.alert("E-mail address not registered!");
//       //$("#msg").html("E-mail address not registered!")
//       throw new Error('E-mail address not registered');
//     } else if (voterCheck == 2) {
//       window.alert("E-mail address and Ethereum address mismatch!");
//       //$("#msg").html("E-mail address and Ethereum address mismatch!")
//       throw new Error('E-mail address and Ethereum address mismatch.');
//     } else {
//       v = await registrarContract.getPermission(emailToBytes);
//       let emailCheck = v.toString();
//       if (emailCheck == 0) {
//         // 作成権限がないためエラーを表示
//         //$("#msg3").html("You are not authorized to create ballots! Please contact admin to request authorization.")
//         window.alert("You are not authorized to create ballots! Please contact admin to request authorization.");
//         throw new Error(cemail, " isn't authorized to create ballots.");
//       } else {
//         let date = $("#date").val();
//         let enddate = Date.parse(date).getTime() / 1000;
//         let time = $("#time").val();
//         //Testnet is plus 7 hours
//         //-21600 to get original end date and time on testnet
//         let timeArray = time.split(":");
//         //Testnet is plus 7 hours, uncomment this line if testing on testnet
//         //var seconds = ((timeArray[0]*60)*60) + (timeArray[1]*60) + 21600
//         let seconds = timeArray[0] * 60 * 60 + timeArray[1] * 60; // 秒数表示
//         enddate += seconds; // 投票期限を取得
//         let ballottype = $("input[name=ballottype]:checked").val(); // 投票形式を取得 poll or election
//         let title = $("#vtitle").val(); // 投票タイトルを取得
//         let choices = $("#choices").val(); // 候補者名一覧を取得
//         var choicesArray = choices.split(/\s*,\s*/); // 候補社名をリストで取得
//         let votelimit = $("#votelimit").val(); // 投票回数を取得
//         let whitelist = $("input[name=whitelist]:checked").val(); // ホワイトリストの形式を取得
//         let whitelisted = $("#whitelisted").val(); // ホワイトリストに登録したいメールアドレスを取得
//         let whitelistedArray = whitelisted.split(/\s*,\s*/); // ホワイトリストをリスト形式で取得
//         let ballotid = Math.floor(Math.random() * 4294967295); // 投票用紙IDをランダムで生成

//         try {
//           let result = await creatorContract.createBallot(enddate, ballottype, votelimit, ballotid, title, whitelist);
//           console.log('Ballot作成完了', '\nTX HASH: ', result);
//         } catch (error) {
//           console.error(error);
//           throw new Error('Ballot作成失敗');
//         }

//         // creatorContract.createBallot(enddate, ballottype, votelimit, ballotid, title, whitelist)
//         //   .then(function (result) {
//         //     console.log('Ballot作成完了', '\nTX HASH: ', result);
//         //   })
//         //   .catch(function (error) {
//         //     console.error(error);
//         //     throw new Error('Ballot作成失敗');
//         //   });

//         sleep(20000);
//         console.log("1秒経過");

//         try {
//           v = await creatorContract.getAddress(ballotid);
//           console.log('VotingAddress: ', v);
//           let votingAddress = v.toString();
//           fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid);
//           registerBallot(votingAddress, ballotid);
//         } catch (error) {
//           console.error('VotingAddress, 選択肢, ホワイトリスト, BallotIDをコントラクトに登録できませんでした');
//           console.error('エラー: ', error);
//         }
//       }
//     }
//     console.log('Ballot作成が正常に完了しました');
//   } catch (error) {
//     console.error(error);
//     console.error('Ballot作成リクエストは完了しませんでした');
//   }
// };

function sleepByPromise(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

function sleep(waitMsec) {
  var startMsec = new Date();

  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

window.getVotingAddress = function () {
  var ballotid1 = $('#votingAddress').val();
  creatorContract.getAddress(ballotid1, (error, v) => {
    console.log('作成したvotingアドレス=' + v);
  });
};

// Votingコントラクトのアドレスと投票用紙idをRegistrarコントラクトに登録
function registerBallot(votingaddress, ballotid) {
  registrarContract
    .setAddress(votingaddress, ballotid)
    .then(function (result) {
      window.alert(
        'Ballot creation successful! Ballot ID: ' +
          ballotid +
          '\nPlease write the down the Ballot ID because it will be used to load your ballot allowing users to vote'
      );
      console.log('Ballot ID: ' + ballotid);
      console.log('TX HASH: ', result);
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

// Candidate, Whitelistをコントラクトに登録
function fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid) {
  fillCandidates(votingAddress, choicesArray);
  if (whitelist == 1) {
    fillWhitelisted(votingAddress, whitelistedArray);
  }
}

function fillCandidates(votingAddress, choicesArray) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);

  votingContract
    .setCandidates(strTobyterser.StringArrayToBytes32(choicesArray))
    .then(function (result) {
      console.log('Candidateの設定完了\nTX HASH: ', result);
      votingContract.hashCandidates().then(function (result) {
        console.log('Candidateのハッシュ化完了\nTX HASH: ', result);
      });
    });
}

function fillWhitelisted(votingAddress, whitelistedArray) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
  // votingContract = web3.eth.contract(votingABI).at(votingAddress);
  votingContract.setWhitelisted(strTobyterser.StringArrayToBytes32(whitelistedArray));
}

window.AddDomain = () => {
  var domain = $('#domainAdress').val();
  var domainBytes32 = strTobyterser.StringToBytes32(domain);

  registrarContract
    .addDomains(domainBytes32)
    .then(function (result) {
      console.log('次のドメイン登録が完了しました: ', domain, '\nTX HASH', result);
    })
    .catch(function (error) {
      console.error('ドメイン登録でエラーが発生しました');
      throw new Error(error);
    });
};

function getCandidates(votingAddress, ballotID) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
  console.log('getCandidates中');

  votingContract.getTitle().then(function (title) {
    $('#btitle').html(title);
    votingContract.candidateList(ballotID).then(function (candidateArray) {
      if (candidateArray.length <= 0) console.log('候補者は0人です');

      for (let i = 0; i < candidateArray.length; i++) {
        // 連想配列candidatesのkeyに候補者名, valueに候補者名のidを設定
        candidates[web3.toUtf8(candidateArray[i])] = 'candidate-' + i;
      }
      setupTable();
      getVotes(votingAddress);
    });
  });
  console.log('getCandidates終了');
}

// テーブルの表示をする
function setupTable() {
  Object.keys(candidates).forEach(function (candidate) {
    // 該当テーブルにcandidatesのkeyを一覧表示して, 各要素にidを設定する
    $('#candidate-rows').append(
      '<tr><td>' + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>"
    );
  });
}

window.validCandidate = function () {
  var candidateName12 = $('#candidateName12').val();
  let encodeName = strTobyterser.AbiEncode(candidateName12);
  let cvHash = ethers.utils.keccak256(encodeName); // 候補者名を32bitサイズでハッシュ化
  console.log(cvHash);
  console.log('ballotID=' + ballotID);
  creatorContract.getAddress(ballotID, (error, v) => {
    console.log('作成したvotingアドレス=' + v);
    var votingAddress = v.toString();
    let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
    // var votingContract = web3.eth.contract(votingABI).at(votingAddress);
    // var subscription = web3.eth.subscribe('logs', {
    //   address: votingAddress
    // }, function(error, result){
    //   if (!error)
    //       console.log(result);
    // });
    votingContract.validCandidate(cvHash, function (error, result) {
      // votingContract.once('Bool', {
      //   fromBlock: 0
      // }, function(error, event){ console.log(event); });
      var boolEvent = votingContract.Bool({ fromBlock: 308, toBlock: 308 });
      var cnt = 0;
      boolEvent.watch((error, result) => {
        cnt++;
        console.log(result.args.judge);
        // console.log("cnt="+cnt);
        if (cnt == 2) {
          boolEvent.stopWatching();
        }
      });
    });
  });
};

function getVotes(votingAddress) {
  Object.keys(candidates).forEach((name) => {
    let encodeName = strTobyterser.AbiEncode(name);
    let cvHash = ethers.utils.keccak256(encodeName); // 候補者名を32bitサイズでハッシュ化

    let votingContract = new ethers.Contract(votingAddress, votingABI, signer);

    votingContract.totalVotesFor(cvHash).then(function (convVote) {
      if (convVote == 0) {
        votingContract.getTimelimit().then(function (result) {
          var endtime = result.toString();
          endtime = new Date(endtime * 1000);
          $('#msg').html(
            'Results will be displayed once the voting period has ended (' + endtime + ')'
          );
        });
      } else {
        console.log('復号開始');
        convVote = scientificToDecimal(convVote); // 10進数に変換
        $('#' + candidates[name]).html(convVote); // 該当idに投票結果を表示
        decrypt(convVote, name); // convVoteを復号し, 結果を該当テーブルに表示
      }
    });
  });
}

// convVoteを復号し, id=nameのセルに復号結果を表示
function decrypt(convVote, name) {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/crypto/decrypt/' + convVote,
    success: function (eoutput) {
      console.log('復号完了');
      var voteNum = eoutput; // 復号結果を格納
      $('#' + candidates[name]).html(voteNum.toString()); // 該当idに投票結果を表示
    },
  });
}
