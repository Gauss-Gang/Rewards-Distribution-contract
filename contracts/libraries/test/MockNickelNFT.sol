// This is a simplified mock NFT contract for testing purposes
// In practice, you would use a standard ERC721 or ERC1155 contract
// This mock contract includes a function to mint NFTs for testing

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "../token/ERC721.sol";
import {Ownable} from "../access/Ownable.sol";

contract MockNickelNFT is ERC721, Ownable {
    constructor(
        address initialOwner
    ) ERC721("Nickel NFT", "NICKEL") Ownable() {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
