const Careator = artifacts.require("Careator");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Careator", function (/* accounts */) {
  it("should assert true", async function () {
    await Careator.deployed();
    return assert.isTrue(true);
  });
});
