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
