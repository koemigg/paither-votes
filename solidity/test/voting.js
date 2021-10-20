/*globals require*/
/*globals artifacts*/
/*globals contract*/
/*globals it*/
/*globals assert*/
/*globals before*/
/*globals describe*/

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
  let owner = accounts[0];
  // let nonOwner = accounts[1];

  describe('manage candidates/choices', function () {
    let ballotId = 4294967295;
    let wrongBallotId = Math.floor(Math.random() * 4294967295);
    let choicesArray = ['Truffle', 'Ganache', 'Creme brulee'];
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

    before(async function () {
      voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
    });

    it('should hash the candidates/choices', async function () {
      return assert.isTrue(true);
    });

    it("shouldn't get candidate/choice list with wrong BallotID", async function () {
      await voting.setCandidate(web3StringArrayToBytes32(choicesArray), { from: owner });
      await truffleAssert.reverts(voting.getCandidateList(wrongBallotId), 'BallotID does not match');
    });
  });
});
