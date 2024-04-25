require("@nomicfoundation/hardhat-toolbox");
const { mnemonic } = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
        optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    testnet: {
      url: "http://10.0.0.24:8554",
      chainId: 1452,
      accounts: {mnemonic: mnemonic}
    },
    mainnet: {
      url: "https://rpc.gaussgang.com",
      chainId: 1777,
      accounts: {mnemonic: mnemonic}
    }
  }
};