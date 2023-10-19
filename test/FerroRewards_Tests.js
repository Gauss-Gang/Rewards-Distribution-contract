const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FerroRewards", function () {
  let contract;
  let deployer;
  let recipient1;
  let recipient2;
  let rewardToken;
  let mockIronNFT;
  let mockNickelNFT;
  let mockCobaltNFT;

  beforeEach(async function () {
    [deployer, recipient1, recipient2] = await ethers.getSigners();

    // Deploy mock Token contract for testing
    const RewardToken = await ethers.getContractFactory("MockRewardToken");
    rewardToken = await RewardToken.deploy();

    // Deploy mock NFT contracts for testing
    const MockIronNFT = await ethers.getContractFactory("MockIronNFT", deployer);
    mockIronNFT = await MockIronNFT.deploy(deployer);

    const MockNickelNFT = await ethers.getContractFactory("MockNickelNFT", deployer);
    mockNickelNFT = await MockNickelNFT.deploy(deployer);

    const MockCobaltNFT = await ethers.getContractFactory("MockNickelNFT", deployer);
    mockCobaltNFT = await MockCobaltNFT.deploy(deployer);

    const mockIronAddress = await mockIronNFT.getAddress();
    const mockNickelAddress = await mockNickelNFT.getAddress();
    const mockCobaltAddress = await mockCobaltNFT.getAddress();

    // Mint NFTs to simulate ownership
    await mockIronNFT.safeMint(recipient1.getAddress(), 1);
    await mockNickelNFT.safeMint(recipient1.getAddress(), 1);
    await mockCobaltNFT.safeMint(recipient1.getAddress(), 1);

    // Mint Iron NFT for recipient2
    await mockIronNFT.safeMint(recipient2.getAddress(), 2);

    // Deploy the main contract with the mock NFT contract addresses
    const FerroRewards = await ethers.getContractFactory("FerroRewards");
    contract = await FerroRewards.deploy(
      mockIronAddress,
      mockNickelAddress,
      mockCobaltAddress
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
    const amount = 100000;


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
    
    const amount = 100000;
    await rewardToken.connect(deployer).approve(contract.getAddress(), amount);

    await contract.connect(deployer).depositTokens(amount, tokenAddress);

    const mockIronAddress = await mockIronNFT.getAddress();
    const mockNickelAddress = await mockNickelNFT.getAddress();
    const mockCobaltAddress = await mockCobaltNFT.getAddress();

    const ironPercentage = 5000;
    const nickelPercentage = 3000;
    const cobaltPercentage = 2000;

    const ironAllocation = (amount * ironPercentage) / 10000;
    const nickelAllocation = (amount * nickelPercentage) / 10000;
    const cobaltAllocation = (amount * cobaltPercentage) / 10000;

    const ironBalance = await contract.connect(deployer).rewardsBalance(mockIronAddress, tokenAddress);
    const nickelBalance = await contract.connect(deployer).rewardsBalance(mockNickelAddress, tokenAddress);
    const cobaltBalance = await contract.connect(deployer).rewardsBalance(mockCobaltAddress, tokenAddress);

    expect(ironBalance).to.equal(ironAllocation);
    expect(nickelBalance).to.equal(nickelAllocation);
    expect(cobaltBalance).to.equal(cobaltAllocation);
  });

  it("should perform airdrop of tokens correctly", async function () {
    const tokenAddress = await rewardToken.getAddress();
    const amount = 100000;
  
    // Deposit tokens and simulate NFT ownership
    await rewardToken.connect(deployer).approve(contract.getAddress(), amount);
    await contract.connect(deployer).depositTokens(amount, tokenAddress);
  
    // Check if recipient1 owns NFTs
    const recipient1IronBalance = await mockIronNFT.balanceOf(recipient1.getAddress());
    const recipient1NickelBalance = await mockNickelNFT.balanceOf(recipient1.getAddress());
    const recipient1CobaltBalance = await mockCobaltNFT.balanceOf(recipient1.getAddress());
  
    // Check if recipient2 owns NFTs
    const recipient2IronBalance = await mockIronNFT.balanceOf(recipient2.getAddress());

  
    // Assert that the recipients own the NFTs
    expect(recipient1IronBalance).to.equal(1);
    expect(recipient1NickelBalance).to.equal(1);
    expect(recipient1CobaltBalance).to.equal(1);
    expect(recipient2IronBalance).to.equal(1);
  
    await contract.connect(deployer).updateTotalAirdropCount(1);
  
    const initialRecipient1Balance = await rewardToken.balanceOf(recipient1.getAddress());
    const initialRecipient2Balance = await rewardToken.balanceOf(recipient2.getAddress());
  
  
    // Update the recipient addresses and NFT amounts using the smart contract function
    // Update the recipient addresses and NFT amounts using the smart contract function
  await contract.connect(deployer).updateRecipients(
  [recipient1.getAddress(), recipient2.getAddress()], // Provide recipient addresses
  [1, 1], // Set the number of Iron NFTs for each recipient
  [1, 0], // Set the number of Nickel NFTs (0 for recipient2)
  [1, 0] // Set the number of Cobalt NFTs (0 for recipient2)
  );
  
    // Perform the airdrop
    await contract.connect(deployer).airdropTokens();
  
    

    // Check recipient1's token balance after airdrop
    const recipient1Balance = await rewardToken.balanceOf(recipient1.getAddress());
    expect(recipient1Balance).to.equal(14);
  
    // Check recipient2's token balance after airdrop
    const recipient2Balance = await rewardToken.balanceOf(recipient2.getAddress());
    expect(recipient2Balance).to.equal(2); 
  });
  

});
