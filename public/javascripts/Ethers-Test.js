// Test

/*globals $*/
/*globals Web3*/
/*globals web3*/
/*globals ethers*/
/*globals StringToBytes*/

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

let creatorContract;
let registrarContract;

let signer;
let strTobyterser = new StringToBytes();

let provider;

window.onload = async function () {
  //   provider = window.ethereum;
  provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  //   provider = new ethers.providers.Web3Provider(window.ethereum, );
  if (provider) {
    // Prompt user for account connections
    await provider.send('eth_requestAccounts', []);
    console.log('Provider:', provider);
    signer = provider.getSigner();
    console.log('Account:', await signer.getAddress());
    startApp(provider);
  } else {
    console.log('Please install MetaMask!');
  }
};

function startApp(provider) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  //   if (provider !== window.ethereum)
  //     console.error("Do you have multiple wallets installed?");
  // Access the decentralized web!
  signer = provider.getSigner();
  creatorContract = new ethers.Contract(creatorAddress, creatorABI, signer);
  registrarContract = new ethers.Contract(registrarAddress, registrarABI, signer);
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
      console.error('ドメイン登録でエラーが発生しました: ', error);
    });
};

window.checkSigner = async () => {
  // console.log("Provider:", provider);
  // signer = provider.getSigner();
  console.log('Singner:', signer);
  console.log('Address:', await signer.getAddress());
};

window.ballotSetup = async function () {
  try {
    let cemail = $('#cemail').val();
    let emailToBytes = strTobyterser.StringToBytes32(cemail);

    registrarContract.checkVoter(emailToBytes).then(function (v) {
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
          let emailCheck = v.toString();
          if (emailCheck == 0) {
            // 作成権限がないためエラーを表示
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
            var choicesArray = choices.split(/\s*,\s*/); // 候補社名をリストで取得
            let votelimit = $('#votelimit').val(); // 投票回数を取得
            let whitelist = $('input[name=whitelist]:checked').val(); // ホワイトリストの形式を取得
            let whitelisted = $('#whitelisted').val(); // ホワイトリストに登録したいメールアドレスを取得
            let whitelistedArray = whitelisted.split(/\s*,\s*/); // ホワイトリストをリスト形式で取得
            let ballotid = Math.floor(Math.random() * 4294967295); // 投票用紙IDをランダムで生成

            creatorContract
              .createBallot(enddate, ballottype, votelimit, ballotid, title, whitelist)
              .then(function (result) {
                console.log('Ballot作成完了', '\nTX HASH: ', result);
                creatorContract
                  .getAddress(ballotid)
                  .then(function (v) {
                    console.log('VotingAddress: ', v);
                    let votingAddress = v.toString();
                    fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist);
                    registerBallot(votingAddress, ballotid);
                    console.log('Ballot作成が正常に完了しました');
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
    });
  } catch (error) {
    console.error(error);
    console.error('Ballot作成リクエストは完了しませんでした');
  }
};

// Candidate, Whitelistをコントラクトに登録
function fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist) {
  fillCandidates(votingAddress, choicesArray);
  if (whitelist == 1) {
    fillWhitelisted(votingAddress, whitelistedArray);
  }
}

function fillCandidates(votingAddress, choicesArray) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
  // var votingContract = web3.eth.contract(votingABI).at(votingAddress);

  votingContract
    .setCandidates(strTobyterser.StringArrayToBytes32(choicesArray))

    .then(function (result) {
      console.log('Candidateの設定完了\nTX HASH: ', result);
    })
    .then(votingContract.hashCandidates())
    .then(function (result) {
      console.log('Candidateのハッシュ化完了\nTX HASH: ', result);
    });
}

function fillWhitelisted(votingAddress, whitelistedArray) {
  let votingContract = new ethers.Contract(votingAddress, votingABI, signer);
  // votingContract = web3.eth.contract(votingABI).at(votingAddress);
  votingContract.setWhitelisted(strTobyterser.StringArrayToBytes32(whitelistedArray));
}

// Votingコントラクトのアドレスと投票用紙idをRegistrarコントラクトに登録
function registerBallot(votingaddress, ballotid) {
  //   registrarContract.setAddress(votingaddress, ballotid, (error, result) => {
  //     window.alert(
  //       "Ballot creation successful! Ballot ID: " +
  //         ballotid +
  //         "\nPlease write the down the Ballot ID because it will be used to load your ballot allowing users to vote"
  //     );
  //     console.log("Ballot ID:" + ballotid);
  //   });
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
