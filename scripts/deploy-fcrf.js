// Deploys the Ferro Rewards contract.
const { ethers } = require("hardhat");

async function main() {

    const FerroRewards = await ethers.getContractFactory("FerroCardRewardFunnel");
    console.log('Deploying FerroCardRewardFunnel Contract...');

    // Set the parameters needed to launch the FerroCardRewardFunnel contract
    const IRON_NFT_ADDRESS = "0x16b8519599d1e42fb365B79956dC93210A0aa0aE";
    const NICKEL_NFT_ADDRESS = "0xEae77EE3ec8C2170e32C00c51159aC8471E2cc7F";
    const COBALT_NFT_ADDRESS = "0x9FA767cE8B6a623151D91cd2D9b7000F3761F9a3";

    const contract = await FerroRewards.deploy(IRON_NFT_ADDRESS,NICKEL_NFT_ADDRESS,COBALT_NFT_ADDRESS);
    console.log("FerroCardRewardFunnel deployed to:", await contract.getAddress());

    await new Promise(resolve => setTimeout(resolve, 15000)); // Delay of 15 seconds before checking address
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });