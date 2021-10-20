/*globals require*/
/*globals artifacts*/
/*globals contract*/
/*globals assert*/
/*globals before*/
/*globals describe*/
/*globals it*/

const ethers = require('ethers');
const truffleAssert = require('truffle-assertions');

const Voting = artifacts.require('Voting');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('Voting', function (accounts) {
  let voting;
  const owner = accounts[0];
  // const nonOwner = accounts[1];
  describe('Voting test', () => {
    const ballotId = Math.floor(Math.random() * 4294967295);
    const wrongBallotId = Math.floor(Math.random() * ballotId);
    const choicesArray = ['Truffle', 'Ganache', 'Creme brulee'];
    const web3StringToBytes32 = (str) => {
      let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
      while (result.length < 66) {
        result += '0';
      }
      if (result.length !== 66) {
        throw new Error('invalid web3 implicit bytes32');
      }
      return result;
    };
    const web3StringArrayToBytes32 = (strArray) => {
      var bytes32Array = [];
      strArray.forEach((element) => {
        bytes32Array.push(web3StringToBytes32(element));
      });
      return bytes32Array;
    };
    const AbiEncode = (str) => {
      var bytes = str.split('').map((char) => char.charCodeAt(0));
      var hexs = bytes.map((byte) => byte.toString(16));
      var hex2 = hexs.length.toString(16);
      console.log(hex2);
      var hex = hexs.join('');
      var bytes1 = '0000000000000000000000000000000000000000000000000000000000000020';
      var bytes2 = ('0000000000000000000000000000000000000000000000000000000000000000' + hex2).slice(-64);
      var bytes3 = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64);
      var encodeBytes = '0x' + bytes1 + bytes2 + bytes3;
      return encodeBytes;
    };

    describe('manage candidates/choices', () => {
      before(async function () {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
      });
      it('should the register/hashing and get/decode candidates/choices', async () => {
        await voting.setCandidate(web3StringArrayToBytes32(choicesArray), { from: owner });
        await voting.hashCandidates({ from: owner });
        const candidateList = await voting.getCandidateList(ballotId);
        const result = candidateList.map((c) => ethers.utils.parseBytes32String(c));
        assert.deepStrictEqual(result, choicesArray);
      });

      it("shouldn't get candidate/choice list with wrong BallotID", async function () {
        await truffleAssert.reverts(voting.getCandidateList(wrongBallotId), 'BallotID does not match');
      });
    });

    describe('new test', () => {
      before(async function () {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
      });
      it('should assert true', async function () {
        return assert.isTrue(true);
      });
    });
  });
});
