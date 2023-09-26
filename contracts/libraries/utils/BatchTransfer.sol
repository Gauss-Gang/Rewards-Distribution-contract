// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../token/ERC20.sol";


contract BatchTransfer {

    // To transfer tokens from Contract to the provided list of token holders with respective amount
    function batchTransfer(ERC20 token, address[] calldata tokenHolders, uint256[] calldata amounts) external {
        require(tokenHolders.length == amounts.length, "Invalid input parameters");

        for(uint256 index = 0; index < tokenHolders.length; index++) {
            require(token.transferFrom(msg.sender, tokenHolders[index], amounts[index]), "Unable to transfer token to the account");
        }
    }


    // To withdraw tokens from contract, to deposit directly transfer to the contract
    function withdrawToken(ERC20 token, uint256 value) public {

        // Check if contract is having required balance 
        require(token.balanceOf(address(this)) >= value, "Not enough balance in the contract");
        require(token.transfer(msg.sender, value), "Unable to transfer token to the owner account");
    }
}