// Deploys the Ferro Snapshot contract.
const { ethers } = require("hardhat");

async function main() {

    const FerroSnapshot = await ethers.getContractFactory("FerroSnapshot");
    console.log('Deploying FerroSnapshot Contract...');

    // Set the parameters needed to launch the FerroSnapshot contract
    

    const contract = await FerroSnapshot.deploy();
    console.log("FerroSnapshot deployed to:", await contract.getAddress());

    await new Promise(resolve => setTimeout(resolve, 15000)); // Delay of 15 seconds before checking address
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });