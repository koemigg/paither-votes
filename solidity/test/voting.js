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
      before(async () => {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
        await voting.setCandidate(web3StringArrayToBytes32(choicesArray), { from: owner });
        await voting.hashCandidates({ from: owner });
      });

      it('should register and hashing candidates/choices', async () => {
        const candidateList = await voting.getCandidateList(ballotId);
        // TODO Should use assert.notDeepStrictEqual()
        assert.notStrictEqual(candidateList, choicesArray);
      });

      it('should get and decode candidates/choices', async () => {
        const candidateList = await voting.getCandidateList(ballotId);
        const result = candidateList.map((c) => ethers.utils.parseBytes32String(c));
        assert.deepStrictEqual(result, choicesArray);
      });

      it("shouldn't get candidate/choice list with wrong BallotID", async () => {
        await truffleAssert.reverts(voting.getCandidateList(wrongBallotId), 'BallotID does not match');
      });
    });

    describe('voter registration and management of whitelisted email addresses and domains', () => {
      before(async () => {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
      });

      it('register as a voter', async () => {
        return assert.isTrue(true);
      });

      it("not registered, can't vote", async () => {
        return assert.isTrue(true);
      });

      it('user with E-mail address that is on the whitelist can vote', async () => {
        return assert.isTrue(true);
      });

      it('user with domain that is on the whitelist can vote', async () => {
        return assert.isTrue(true);
      });

      it("user with E-mail address that is not on the whitelist can't vote", async () => {
        return assert.isTrue(true);
      });

      it("user with domain that is not on the whitelist can't vote", async () => {
        return assert.isTrue(true);
      });
    });

    describe('voting', () => {
      before(async () => {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
      });

      it('should increase that the number of votes cast for a voted candidate/option', async () => {
        return assert.isTrue(true);
      });
    });
  });
});
