const Voting = artifacts.require('Voting')

module.exports = function (deployer) {
  deployer.deploy(
    Voting,
    1000,
    1,
    1,
    1220,
    'first_deploy',
    1,
    [],
    [],
    [1, 1],
    '0x38BF2969eA000a2aFe77b23E1B75C53DF84543a3'
  )
}
