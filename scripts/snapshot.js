import { ethers } from "ethers";
import "dotenv/config";
const { ALCHEMY_KEY, IRON_NFT_ADDRESS, NICKEL_NFT_ADDRESS, COBALT_NFT_ADDRESS, IRON_SUPPLY, NICKEL_SUPPLY, COBALT_SUPPLY } = process.env;

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
      },];

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
];

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_KEY);

// Initialize contract instances for each NFT type
const ironContract = new ethers.Contract(IRON_NFT_ADDRESS, IRON_ABI, provider);
const nickelContract = new ethers.Contract(NICKEL_NFT_ADDRESS, NICKEL_ABI, provider);
const cobaltContract = new ethers.Contract(COBALT_NFT_ADDRESS, COBALT_ABI, provider);

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

export default getSnapshotForAllNFTs;
