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

    // Deploy the NFT contracts 
    const ironNFTContract = "0x1234567890123456789012345678901234567890";
    const nickelNFTContract = "0x9876543210987654321098765432109876543210";
    const cobaltNFTContract = "0x5678901234567890123456789012345678901234";
    
    const RewardToken = await ethers.getContractFactory("MockRewardToken");
    rewardToken = await RewardToken.deploy();
    

    const FerroRewards = await ethers.getContractFactory("FerroRewards");
    contract = await FerroRewards.deploy(
      ironNFTContract,
      nickelNFTContract,
      cobaltNFTContract
    );
      
    return {contract, deployer, recipient1, recipient2};
  });

  it("should deploy the contract", async function () {
    await expect(contract.address).to.not.equal(0);
  });

  it("should set the owner to the deployer", async function () {
    const owner = await contract.owner();
    await expect(owner).to.equal(deployer.address);
  });

  it("should deposit tokens", async function () {
    // Example token address (replace with a real address)
    const tokenAddress = await rewardToken.getAddress();
    // Example token amount
    const amount = 10000;


    await rewardToken.connect(deployer).approve(contract.getAddress(), amount);
    await contract.connect(deployer).depositTokens(amount, tokenAddress);

    const depositedTokens = await contract.getDepositedTokens();
    await expect(depositedTokens).to.include(tokenAddress);
  });

  it("Should revert when non-owner tries to pause the contract", async function () {
    await expect(
      contract.connect(recipient1).pause()
    ).to.be.revertedWith("Ownable: caller is not the owner");
});


it("Should revert when non-owner tries to unpause the contract", async function () {
    await contract.connect(deployer).pause(); // Pause the contract first
    await expect(
      contract.connect(recipient1).unpause()
    ).to.be.revertedWith("Ownable: caller is not the owner");
});

  it("should distribute tokens to NFT pools based on NFT ownership", async function () {

    const tokenAddress = await rewardToken.getAddress();
    
    const amount = 10000;
    await rewardToken.connect(deployer).approve(contract.getAddress(), amount);

    await contract.connect(deployer).depositTokens(amount, tokenAddress);

    const ironNFTContract = "0x1234567890123456789012345678901234567890";
    const nickelNFTContract = "0x9876543210987654321098765432109876543210";
    const cobaltNFTContract = "0x5678901234567890123456789012345678901234";

    const ironPercentage = 5000;
    const nickelPercentage = 3000;
    const cobaltPercentage = 2000;

    const ironAllocation = (amount * ironPercentage) / 10000;
    const nickelAllocation = (amount * nickelPercentage) / 10000;
    const cobaltAllocation = (amount * cobaltPercentage) / 10000;

    const ironBalance = await contract.connect(deployer).rewardsBalance(ironNFTContract, tokenAddress);
    const nickelBalance = await contract.connect(deployer).rewardsBalance(nickelNFTContract, tokenAddress);
    const cobaltBalance = await contract.connect(deployer).rewardsBalance(cobaltNFTContract, tokenAddress);

    expect(ironBalance).to.equal(ironAllocation);
    expect(nickelBalance).to.equal(nickelAllocation);
    expect(cobaltBalance).to.equal(cobaltAllocation);
  });
});
