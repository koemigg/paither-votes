/*globals artifacts*/
/*globals contract*/
/*globals it*/
/*globals assert*/
/*globals before*/

const Creator = artifacts.require('Creator');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('Creator', function (/* accounts */) {
  let creator;
  let ballotId = 4294967295;

  before(async () => {
    creator = await Creator.deployed();
  });

  it('can get the voting address from the ballotid', () => {
    creator.createBallot(1000000, 0, 3, ballotId, 'Title', 0).then(async (votingAddress) => {
      let result = await creator.getAddress(ballotId);
      assert.equal(result, votingAddress);
    });
  });

  it('can get the ballotid from the voting address', () => {
    creator.createBallot(1000000, 0, 3, ballotId, 'Title', 0).then(async (votingAddress) => {
      let result = await creator.getBallotId(votingAddress);
      assert.equal(result, ballotId);
    });
  });
});
