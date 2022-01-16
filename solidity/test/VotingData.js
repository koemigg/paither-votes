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

  // const SOLIDITY_MAX_INT = BigInt(Math.pow(2, 256)) - 1n;
  // console.log('BigInt(SOLIDITY_MAX_INT): ' + SOLIDITY_MAX_INT);
  const bitLength = 1024;
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

  function zeroPadding(NUM, LEN) {
    return (Array(LEN).join('0') + NUM).slice(-LEN);
  }

  const BigIntToSolBigInt = (value, bitLength = 1024, size = 256) => {
    console.assert(bitlengthCount(value) <= bitLength, `値が${bitLength}bit以上`);
    console.assert(bitLength % size == 0, `bitLengthが${size}で割り切れる`);
    const iterations = bitLength / size;
    const result = [];
    const value_bin_str = zeroPadding(value.toString(2), bitLength);
    let offset = 0;
    for (let i = 0; i < iterations; i++) {
      const item = Number(value_bin_str.slice(offset, offset + size)) == 0 ? 0n : BigInt('0b' + value_bin_str.slice(offset, offset + size));
      result.unshift(item);
      offset += size;
    }
    return result;
  };

  const SolBigIntToBigInt = (values, size = 256) => {
    let result = 0n;
    values.forEach((value, index) => {
      const multiplier = BigInt(size) * BigInt(index);
      result += BigInt(value) * 2n ** multiplier;
    });
    return BigInt(result);
  };

  const bitlengthCount = (value) => {
    return value.toString(2).length;
  };

  it(`鍵の長さ: ${bitLength} bit`, () => {
    assert.isTrue(true);
  });

  it('公開鍵、秘密鍵、投票結果をコントラクトに保存する', async () => {
    // Setup
    const { publicKey, privateKey } = await paillier.generateRandomKeys(bitLength);
    const n = publicKey.n;
    const g = publicKey.g;
    const mu = privateKey.mu;
    const lambda = privateKey.lambda;
    const votingData = await VotingData.new(1000000, 0, 3, ballotId, 'Title', 0, W3SATB32(choices), [], [0, 0], owner);
    let actuall_result_votes = 0n;

    // Set Public key
    const g_converted = BigIntToSolBigInt(g, 2048);
    await votingData.setPublicKey(BigIntToSolBigInt(n), g_converted);

    // [Vote Phase] Voter 1
    const publicKey_voter = await (async () => {
      const arr = await votingData.getPublicKey();
      return new paillier.PublicKey(SolBigIntToBigInt([arr[0], arr[1], arr[2], arr[3]]), SolBigIntToBigInt([arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10], arr[11]]));
    })();

    expect(publicKey).to.deep.equal(publicKey_voter, 'コントラクトを経由して公開鍵を取得しても値は変わらない');
    const m = 100n;
    const c1 = publicKey_voter.encrypt(m);
    const encrypted_now_votes_1 = await (async () => {
      const arr = await votingData.getNumber();
      return SolBigIntToBigInt([arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]]);
    })();
    const encrypted_sum1 = publicKey_voter.addition(c1, BigInt(encrypted_now_votes_1));
    await votingData.setNumber(BigIntToSolBigInt(encrypted_sum1, 2048));
    actuall_result_votes += m;

    // [Vote Phase] Voter 2
    const c2 = publicKey_voter.encrypt(m);
    const encrypted_now_votes_2 = await (async () => {
      const arr = await votingData.getNumber();
      return SolBigIntToBigInt([arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]]);
    })();
    const encrypted_sum2 = publicKey_voter.addition(c2, BigInt(encrypted_now_votes_2));
    await votingData.setNumber(BigIntToSolBigInt(encrypted_sum2, 2048));
    actuall_result_votes += m;

    // [Count Phase] Creator
    await votingData.setPrivateKey(BigIntToSolBigInt(lambda), BigIntToSolBigInt(mu));

    // [Count Phase] Voter
    const encrypted_result_votes = await (async () => {
      const arr = await votingData.getNumber();
      return SolBigIntToBigInt([arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]]);
    })();
    const privateKey_voter = await (async () => {
      const arr = await votingData.getPrivateKey();
      return new paillier.PrivateKey(SolBigIntToBigInt([arr[0], arr[1], arr[2], arr[3]]), SolBigIntToBigInt([arr[4], arr[5], arr[6], arr[7]]), publicKey_voter);
    })();

    const result_votes = privateKey_voter.decrypt(BigInt(encrypted_result_votes));

    expect(actuall_result_votes.toString()).to.equal(result_votes.toString(), 'コントラクトを経由して暗号文を取得しても値は変わらない');
  });
});
