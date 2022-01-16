var Registrar = artifacts.require("Registrar");
var domain = [];

module.exports = function (deployer) {
  deployer.deploy(Registrar, domain);
};
