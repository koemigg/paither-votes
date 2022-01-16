const Voting = artifacts.require('Voting')

module.exports = function (deployer) {
  deployer.deploy(
    Voting,
    1000,
    1,
    1,
    1220,
    'MIGRATIONED',
    1,
    [],
    [],
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    '0x0000000000000000000000000000000000000000'
  )
}
