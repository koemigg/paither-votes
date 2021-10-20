/*globals artifacts*/
/*globals contract*/
/*globals it*/
/*globals assert*/
/*globals before*/

const Creator = artifacts.require("Creator");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Creator", function (/* accounts */) {
  it("should assert true", async function () {
    await Creator.deployed();
    return assert.isTrue(true);
  });

  let creator;
  let ballotId = 4294967295;

  before(async function () {
    creator = await Creator.new();
  });

  it("should be possible to get the address of the voting contract by ballotid", () => {
    creator
      .createBallot(1000000, 0, 3, ballotId, "Title", 0)
      .then(async function (votingAddress) {
        let result = await creator.getAddress(ballotId);
        assert.equal(result, votingAddress);
      });
  });
});
