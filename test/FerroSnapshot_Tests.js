const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FerroSnapshot Smart Contract - Unit Testing", function () {
    let ferroSnapshot;
    let owner;
    let wallet1;
    let wallet2;
  
    beforeEach(async () => {
        [owner, wallet1, wallet2] = await ethers.getSigners();
        
        const FerroSnapshot = await ethers.getContractFactory("FerroSnapshot");
        ferroSnapshot = await FerroSnapshot.deploy();

        return { ferroSnapshot, owner, wallet1, wallet2 };
    });


    it("Should set the owner correctly", async function () {
        expect(await ferroSnapshot.owner()).to.equal(owner.address);
    });

});