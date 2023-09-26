// Deploys the Ferro Rewards contract.
const { ethers } = require("hardhat");

async function main() {

    const FerroRewards = await ethers.getContractFactory("FerroRewards");
    console.log('Deploying FerroRewards Contract...');

    // Set the parameters needed to launch the FerroRewards contract
    

    const contract = await FerroRewards.deploy();
    console.log("FerroRewards deployed to:", await contract.getAddress());

    await new Promise(resolve => setTimeout(resolve, 15000)); // Delay of 15 seconds before checking address
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });