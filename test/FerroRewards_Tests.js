const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FerroRewards", function () {
  let contract;
  let deployer;
  let recipient1;
  let recipient2;

  before(async function () {
    
  });

  beforeEach(async function () {
    [deployer, recipient1, recipient2] = await ethers.getSigners();

    // Deploy the NFT contracts (or generate random addresses)
    const ironNFTContract = ethers.Wallet.createRandom().address;
    const nickelNFTContract = ethers.Wallet.createRandom().address;
    const cobaltNFTContract = ethers.Wallet.createRandom().address;

    const FerroRewards = await ethers.getContractFactory("FerroRewards");
    contract = await FerroRewards.deploy(
      ironNFTContract,
      nickelNFTContract,
      cobaltNFTContract
    );

    return {contract, deployer, recipient1, recipient2};
  });

  it("should deploy the contract", async function () {
    expect(contract.address).to.not.equal(0);
  });

  it("should set the owner to the deployer", async function () {
    const owner = await contract.owner();
    expect(owner).to.equal(deployer.address);
  });

  it("should deposit tokens", async function () {
    // Example token address (replace with a real address)
    const tokenAddress = "0xTokenAddress";
    // Example token amount
    const amount = 10000;

    await contract.depositTokens(amount, tokenAddress);

    const depositedTokens = await contract.getDepositedTokens();
    expect(depositedTokens).to.include(tokenAddress);
  });

  it("should pause and unpause the contract", async function () {
    await contract.pause();
    expect(await contract.isPaused()).to.equal(true);

    await contract.unpause();
    expect(await contract.isPaused()).to.equal(false);
  });

  it("should distribute tokens to NFT pools based on NFT ownership", async function () {
    // Example token address (replace with a real address)
    const tokenAddress = "0xTokenAddress";
    // Example token amount
    const amount = 10000;

    await contract.depositTokens(amount, tokenAddress);

    const ironPercentage = 5000;
    const nickelPercentage = 3000;
    const cobaltPercentage = 2000;

    const ironAllocation = (amount * ironPercentage) / 10000;
    const nickelAllocation = (amount * nickelPercentage) / 10000;
    const cobaltAllocation = (amount * cobaltPercentage) / 10000;

    const ironBalance = await contract.rewardsBalance(ironNFTContract, tokenAddress);
    const nickelBalance = await contract.rewardsBalance(nickelNFTContract, tokenAddress);
    const cobaltBalance = await contract.rewardsBalance(cobaltNFTContract, tokenAddress);

    expect(ironBalance).to.equal(ironAllocation);
    expect(nickelBalance).to.equal(nickelAllocation);
    expect(cobaltBalance).to.equal(cobaltAllocation);
  });
});
