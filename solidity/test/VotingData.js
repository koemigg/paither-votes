/* global BigInt */
const Voting = artifacts.require('Voting');
const VotingData = artifacts.require('VotingData');
const VotingBigNumber = artifacts.require('VotingBigNumber');

const paillier = require('paillier-bigint');
const ethers = require('ethers');

contract('VotingData', function (accounts) {
  const owner = accounts[0];
  const ballotId = Math.floor(Math.random() * 4294967295);
  const choices = ['Truffle', 'Ganache', 'Creme brulee'];

  const SOLIDITY_MAX_INT = BigInt(Math.pow(2, 256) - 1);
  // console.log('BigInt(SOLIDITY_MAX_INT): ' + SOLIDITY_MAX_INT);
  const bitLength = 128;

  // web3StringToBytes32
  const W3STB32 = (str) => {
    let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
    while (result.length < 66) {
      result += '0';
    }
    if (result.length !== 66) {
      throw new Error('invalid web3 implicit bytes32');
    }
    return result;
  };
  // web3StringArrayToBytes32
  const W3SATB32 = (strArray) => {
    var bytes32Array = [];
    strArray.forEach((element) => {
      bytes32Array.push(W3STB32(element));
    });
    return bytes32Array;
  };

  const AbiEncode = (str) => {
    var bytes = str.split('').map((char) => char.charCodeAt(0));
    var hexs = bytes.map((byte) => byte.toString(16));
    var hex2 = hexs.length.toString(16);
    var hex = hexs.join('');
    var bytes1 = '0000000000000000000000000000000000000000000000000000000000000020';
    var bytes2 = ('0000000000000000000000000000000000000000000000000000000000000000' + hex2).slice(-64);
    var bytes3 = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64);
    var encodeBytes = '0x' + bytes1 + bytes2 + bytes3;
    return encodeBytes;
  };

  it(`0. 鍵の長さ: ${bitLength} bit`, function () {
    assert.isTrue(true);
  });

  it('1. 暗号文をアップロードせずに鍵だけをアップロードする (加算は行わない)', async function () {
    const { publicKey, privateKey } = await paillier.generateRandomKeys(bitLength);
    const n = publicKey.n;
    const g = publicKey.g;
    const mu = privateKey.mu;
    const lambda = privateKey.lambda;
    const votingData = await VotingData.new(1000000, 0, 3, ballotId, 'Title', 0, W3SATB32(choices), [], [n, g], owner);
    await votingData.setPrivateKey([lambda, mu]);
    const m = 12345n;
    const c = publicKey.encrypt(m);
    const dec1 = privateKey.decrypt(c);
    const publicKeyParameter = await votingData.getPublicKey();
    const publicKey_voter = new paillier.PublicKey(BigInt(publicKeyParameter[0]), BigInt(publicKeyParameter[1]));
    const privateKeyParameter = await votingData.getPrivateKey();
    const privateKey_voter = new paillier.PrivateKey(BigInt(privateKeyParameter[0]), BigInt(privateKeyParameter[1]), publicKey_voter);
    const dec2 = privateKey_voter.decrypt(c);

    // console.log('n        : ' + n);
    // console.log('pkSeed[0]: ' + pkSeed[0]);
    // console.log('g        : ' + g);
    // console.log('pkSeed[1]: ' + pkSeed[1]);
    // console.log('dec1: ' + dec1);
    // console.log('dec2: ' + dec2);
    // console.log('publicKey: ');
    // console.dir(publicKey, { depth: null });
    // console.log('pk       : ');
    // console.log('privateKey: ');
    // console.dir(pk, { depth: null });
    // console.dir(privateKey, { depth: null });
    // console.log('sk       : ');
    // console.dir(sk, { depth: null });

    expect(publicKey).to.deep.equal(publicKey_voter, '最初に作成した公開鍵とコントラクトから取得した公開鍵は等しい');
    expect(lambda).equal(BigInt(privateKeyParameter[0]), '最初に作成した秘密鍵とコントラクトから取得した秘密鍵は等しい(λ)');
    expect(mu).equal(BigInt(privateKeyParameter[1]), '最初に作成した秘密鍵とコントラクトから取得した秘密鍵は等しい(μ)');
    expect(dec1.toString()).to.equal(m.toString(), '復号した暗号文は平文に等しい (ローカルの鍵使用)');
    expect(dec2.toString()).to.equal(m.toString(), '復号した暗号文は平文に等しい (コントラクトから取得した鍵使用)');
  });

  it('2. 公開鍵、秘密鍵、投票結果をコントラクトに保存する', async function () {
    const { publicKey, privateKey } = await paillier.generateRandomKeys(bitLength);
    const n = publicKey.n;
    const g = publicKey.g;
    const mu = privateKey.mu;
    const lambda = privateKey.lambda;
    const votingData = await VotingData.new(1000000, 0, 3, ballotId, 'Title', 0, W3SATB32(choices), [], [n, g], owner);
    let actuall_result_votes = 0n;

    // [Vote Phase] Voter 1
    const publicKeyParam_voter = await votingData.getPublicKey();
    const publicKey_voter = new paillier.PublicKey(BigInt(publicKeyParam_voter[0]), BigInt(publicKeyParam_voter[1]));
    const m = 100n;
    const c1 = publicKey_voter.encrypt(m);
    const encrypted_now_votes_1 = await votingData.getNumber();
    await votingData.setNumber(publicKey_voter.addition(c1, BigInt(encrypted_now_votes_1)));
    actuall_result_votes += m;

    // [Vote Phase] Voter 2
    const c2 = publicKey_voter.encrypt(m);
    const encrypted_now_votes_2 = await votingData.getNumber();
    await votingData.setNumber(publicKey_voter.addition(c2, BigInt(encrypted_now_votes_2)));
    actuall_result_votes += m;

    // [Count Phase] Creator
    await votingData.setPrivateKey([lambda, mu]);

    // [Count Phase] Voter
    const encrypted_result_votes = await votingData.getNumber();
    const privateKeyParam_voter = await votingData.getPrivateKey();
    const privateKey_voter = new paillier.PrivateKey(BigInt(privateKeyParam_voter[0]), BigInt(privateKeyParam_voter[1]), publicKey_voter);
    const result_votes = privateKey_voter.decrypt(BigInt(encrypted_result_votes));

    expect(result_votes.toString()).to.equal(actuall_result_votes.toString(), 'アップロードされた暗号文を再び取得しても値は変わらない');
  });
});
