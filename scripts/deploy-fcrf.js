// Deploys the Ferro Rewards contract.
const { ethers } = require("hardhat");

async function main() {

    const FerroRewards = await ethers.getContractFactory("FerroCardRewardFunnel");
    console.log('Deploying FerroCardRewardFunnel Contract...');

    // Set the parameters needed to launch the FerroCardRewardFunnel contract
    const IRON_NFT_ADDRESS = "0x3ce1A8eBcEE015B8B48503507e08F0ea1ce4b65F";
    const NICKEL_NFT_ADDRESS = "0xb4d8b3C13cfeB7E6b01A39996e360bc7772135E7";
    const COBALT_NFT_ADDRESS = "0x8481a0476a915A13aF5e295Bee80b5e8F3f2d440";

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