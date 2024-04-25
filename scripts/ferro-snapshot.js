const { ethers } = require("hardhat");

async function main() {

  const [operator, admin, reward, testing] = await ethers.getSigners();

  const IRON_NFT_ADDRESS = "0x3ce1A8eBcEE015B8B48503507e08F0ea1ce4b65F";
  const NICKEL_NFT_ADDRESS = "0xb4d8b3C13cfeB7E6b01A39996e360bc7772135E7";
  const COBALT_NFT_ADDRESS = "0x8481a0476a915A13aF5e295Bee80b5e8F3f2d440";

  // Temporary contract ABIs for each NFT type
  const IRON_ABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
  ];

  const NICKEL_ABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
  ];

  const COBALT_ABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
  ];

  // Initialize contract instances for each NFT type
  const ironContract = new ethers.Contract(IRON_NFT_ADDRESS, IRON_ABI, operator);
  const nickelContract = new ethers.Contract(NICKEL_NFT_ADDRESS, NICKEL_ABI, operator);
  const cobaltContract = new ethers.Contract(COBALT_NFT_ADDRESS, COBALT_ABI, operator);


  // Gets the curernt total supply of a particular contract
  const IRON_SUPPLY = await ironContract.totalSupply();
  const NICKEL_SUPPLY = await nickelContract.totalSupply();
  const COBALT_SUPPLY = await cobaltContract.totalSupply();


  // Initialize a function to get NFT holder data for all three NFT types
  async function getSnapshotForAllNFTs() {
    const combinedData = {};

    for (let i = 0; i < IRON_SUPPLY; i++) {
      let owner = await ironContract.ownerOf(i);
      if (!combinedData[owner]) {
        combinedData[owner] = {
          iron: 0,
          nickel: 0,
          cobalt: 0,
        };
      }
      combinedData[owner].iron += 1;
    }

    for (let i = 0; i < NICKEL_SUPPLY; i++) {
      let owner = await nickelContract.ownerOf(i);
      if (!combinedData[owner]) {
        combinedData[owner] = {
          iron: 0,
          nickel: 0,
          cobalt: 0,
        };
      }
      combinedData[owner].nickel += 1;
    }

    for (let i = 0; i < COBALT_SUPPLY; i++) {
      let owner = await cobaltContract.ownerOf(i);
      if (!combinedData[owner]) {
        combinedData[owner] = {
          iron: 0,
          nickel: 0,
          cobalt: 0,
        };
      }
      combinedData[owner].cobalt += 1;
    }

    return combinedData;
}

console.log("Taking Snapshot of Ferro Cards...");
const snapshotResult = await getSnapshotForAllNFTs();
console.log("Snapshot Result: ", snapshotResult);

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });