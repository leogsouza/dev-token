// Make sure the DevToken contract is included by requiring it.
const DevToken = artifacts.require("DevToken");

// This is an async function, it will accept the Deployer account, the network, and eventual accounts.
module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(DevToken, "DevToken", "DVTK", 18, 5000000);
  const devToken = await DevToken.deployed()
  
};