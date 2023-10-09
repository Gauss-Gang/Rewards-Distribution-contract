// SPDX-License-Identifier: MIT
pragma solidity =0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import {IERC20} from "./libraries/interfaces/IERC20.sol";
import {IERC721} from "./libraries/interfaces/IERC721.sol";
import {ERC20} from "./libraries/token/ERC20.sol";

import {ReentrancyGuard} from "./libraries/utils/ReentrancyGuard.sol";
import {Pausable} from "./libraries/security/Pausable.sol";
import {Ownable} from "./libraries/access/Ownable.sol";
import {BatchTransfer} from "./libraries/utils/BatchTransfer.sol";
import {Math} from "./libraries/utils/Math.sol";

contract FerroRewards is Ownable, Pausable, ReentrancyGuard {
    // State variables
    address public ironNFTContract;
    address public nickelNFTContract;
    address public cobaltNFTContract;

    uint256 private immutable _precisionFactor = 10000;
    uint256 public lastAirdropBlock;

    bool public _paused;

    // Structs & Events

    // Define the NFT pools and their allocations
    struct NFTPool {
        IERC721 nftContract;
        uint256 allocationPercentage;
        uint256 balance;
    }

    NFTPool[] public nftPools;

    // Event to log when the contract is paused
    event PausedContract(address account);

    // Event to log when the contract is unpaused
    event UnpausedContract(address account);

    // Maybe add events for airdrops?

    // Mapping to store the total amount distributed to each NFT pool
    mapping(address => uint256) public totalAmountDistributed;

    // Separate mappings for each NFT tier to hold reward token addresses and amounts to distribute
    mapping(address => uint256) public distributionAmountIronNFT;
    mapping(address => uint256) public distributionAmountNickelNFT;
    mapping(address => uint256) public distributionAmountCobaltNFT;

    // Mappings to keep track of token & NFT distributions
    mapping(address => uint256) public totalTokenDistribution;
    mapping(address => mapping(address => uint256[])) public nftDistributions;

    // Array to store unique token & NFT contract addresses deposited by the owner
    address[] public depositedTokens;
    address[] public depositedNFTContracts;

    constructor(
        address _ironNFTContract,
        address _nickelNFTContract,
        address _cobaltNFTContract
    ) {
        // Initializing the NFT pools with the correct contract addresses
        ironNFTContract = _ironNFTContract;
        nickelNFTContract = _nickelNFTContract;
        cobaltNFTContract = _cobaltNFTContract;

        // Initializing the NFT pools
        nftPools.push(
            NFTPool({
                nftContract: IERC721(ironNFTContract),
                allocationPercentage: 5000,
                balance: 0
            })
        );

        nftPools.push(
            NFTPool({
                nftContract: IERC721(nickelNFTContract),
                allocationPercentage: 3000,
                balance: 0
            })
        );

        nftPools.push(
            NFTPool({
                nftContract: IERC721(cobaltNFTContract),
                allocationPercentage: 2000,
                balance: 0
            })
        );
    }

    // Pause Token Trading and Transfers
    function pause() public onlyOwner {
        super._pause();
    }

    // Unpause Token Trading and Transfers
    function unpause() public onlyOwner {
        super._unpause();
    }

    // Function to deposit ERC20 tokens
    function depositTokens(
        uint256 amount,
        address tokenAddress
    ) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenAddress != address(0), "Invalid token address");

        IERC20 tokenToDeposit = IERC20(tokenAddress);
        require(
            tokenToDeposit.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        // Check if the token address is not already in the array
        bool exists = false;
        for (uint256 i = 0; i < depositedTokens.length; i++) {
            if (depositedTokens[i] == tokenAddress) {
                exists = true;
                break;
            }
        }

        // If the token address is not in the array, add it
        if (!exists) {
            depositedTokens.push(tokenAddress);
        }

        // Call NFT distribution
        NFTdistribution(amount, tokenAddress);
    }

    // Function to deposit NFTs
    function depositNFTs(
        address nftContractAddress,
        uint256[] calldata tokenIds
    ) external onlyOwner {
        require(
            nftContractAddress != address(0),
            "Invalid NFT contract address"
        );
        require(tokenIds.length > 0, "No NFTs to deposit");

        // Transfer NFTs to this contract
        IERC721 nftContract = IERC721(nftContractAddress);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            nftContract.transferFrom(msg.sender, address(this), tokenId);

            // Update NFT distributions
            nftDistributions[nftContractAddress][msg.sender].push(tokenId);
        }

        // Check if the NFT contract address is not already in the array
        bool exists = false;
        for (uint256 i = 0; i < depositedNFTContracts.length; i++) {
            if (depositedNFTContracts[i] == nftContractAddress) {
                exists = true;
                break;
            }
        }

        // If the NFT contract address is not in the array, add it
        if (!exists) {
            depositedNFTContracts.push(nftContractAddress);
        }
    }

    // Function to distribute tokens to NFT pools based on NFT ownership
    function NFTdistribution(
        uint256 amount,
        address tokenAddress
    ) internal whenNotPaused {
        require(amount > 0, "Amount must be greater than zero");

        uint256 totalAllocation = 0; // Total allocation for the three NFT pools

        for (uint256 i = 0; i < nftPools.length; i++) {
            uint256 allocation = Math.mulDiv(
                amount,
                nftPools[i].allocationPercentage,
                _precisionFactor,
                Math.Rounding.Trunc
            );
            console.log(amount);
            console.log(allocation);
            totalAllocation += allocation; // Update the total allocation

            nftPools[i].balance += allocation;

            // Update the total amount distributed to this NFT pool for the specific token
            if (i == 0) {
                distributionAmountIronNFT[tokenAddress][
                    address(nftPools[i].nftContract)
                ] += allocation;
            } else if (i == 1) {
                distributionAmountNickelNFT[tokenAddress][
                    address(nftPools[i].nftContract)
                ] += allocation;
            } else if (i == 2) {
                distributionAmountCobaltNFT[tokenAddress][
                    address(nftPools[i].nftContract)
                ] += allocation;
            }
        }
        console.log(totalAllocation, amount);
        // Check if the total distributed amount matches the expected total allocation
        require(
            totalAllocation <= amount,
            "Total distribution does not match allocations"
        );
    }

    // Function to distribute tokens to NFT holders
    function airdropTokens(
        address[] calldata recipients
    ) external onlyOwner whenNotPaused {
        require(
            block.number - lastAirdropBlock >= 1800,
            "Airdrop interval not reached"
        ); // Change the blocknumber difference for faster / slower airdrops.
        require(recipients.length > 0, "No recipients provided");

        // Iterate through the deposited tokens
        for (
            uint256 tokenIndex = 0;
            tokenIndex < depositedTokens.length;
            tokenIndex++
        ) {
            address tokenAddress = depositedTokens[tokenIndex];

            // Calculate the total balance of the specified token address
            uint256 totalBalance = IERC20(tokenAddress).balanceOf(
                address(this)
            );

            // Ensure there are tokens to distribute
            require(totalBalance > 0, "No tokens available for airdrop");

            // Iterate through the NFT pools
            for (
                uint256 poolIndex = 0;
                poolIndex < nftPools.length;
                poolIndex++
            ) {
                NFTPool storage pool = nftPools[poolIndex];

                // Check if there is a balance in the NFT pool for the current token
                uint256 nftPoolBalance;
                if (tokenAddress == ironNFTContract) {
                    nftPoolBalance = distributionAmountIronNFT[tokenAddress][
                        address(pool.nftContract)
                    ];
                } else if (tokenAddress == nickelNFTContract) {
                    nftPoolBalance = distributionAmountNickelNFT[tokenAddress][
                        address(pool.nftContract)
                    ];
                } else if (tokenAddress == cobaltNFTContract) {
                    nftPoolBalance = distributionAmountCobaltNFT[tokenAddress][
                        address(pool.nftContract)
                    ];
                }

                if (nftPoolBalance > 0) {
                    // Divide the tokens in the pool equally among recipients
                    uint256 amountPerRecipient = nftPoolBalance /
                        recipients.length;

                    // Create arrays to store the recipients and their respective distribution amounts
                    address[] memory recipientsToTransfer = new address[](
                        recipients.length
                    );
                    uint256[] memory amountsToTransfer = new uint256[](
                        recipients.length
                    );

                    // Populate the arrays with recipients and equal amounts
                    for (
                        uint256 recipientIndex = 0;
                        recipientIndex < recipients.length;
                        recipientIndex++
                    ) {
                        address recipient = recipients[recipientIndex];
                        recipientsToTransfer[recipientIndex] = recipient;
                        amountsToTransfer[recipientIndex] = amountPerRecipient;
                    }

                    // Transfer tokens to eligible recipients for the current NFT pool
                    /*BatchTransfer.batchTransfer(
                    IERC20(tokenAddress),
                    recipientsToTransfer,
                    amountsToTransfer
                ); */
                    // Update the last airdrop block
                    lastAirdropBlock = block.number;
                    // Update totalTokenDistribution for this token
                    totalTokenDistribution[tokenAddress] += nftPoolBalance;
                }
            }
        }
    }

    // Function to distribute NFTs to NFT holders
    function distributeNFTs(
        address[] calldata recipients,
        uint256[] calldata tokenIds
    ) external onlyOwner whenNotPaused {
        require(
            recipients.length == tokenIds.length,
            "Invalid input parameters"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 tokenId = tokenIds[i];

            // Iterate through the NFT pools and transfer NFTs to recipients
            for (
                uint256 poolIndex = 0;
                poolIndex < nftPools.length;
                poolIndex++
            ) {
                NFTPool storage pool = nftPools[poolIndex];
                address nftContractAddress = address(pool.nftContract);

                if (nftContractAddress == ironNFTContract) {
                    require(
                        distributionAmountIronNFT[nftContractAddress][
                            recipient
                        ] > 0,
                        "No NFTs available for distribution"
                    );
                } else if (nftContractAddress == nickelNFTContract) {
                    require(
                        distributionAmountNickelNFT[nftContractAddress][
                            recipient
                        ] > 0,
                        "No NFTs available for distribution"
                    );
                } else if (nftContractAddress == cobaltNFTContract) {
                    require(
                        distributionAmountCobaltNFT[nftContractAddress][
                            recipient
                        ] > 0,
                        "No NFTs available for distribution"
                    );
                }

                // Transfer the NFT to the recipient
                pool.nftContract.safeTransferFrom(
                    address(this),
                    recipient,
                    tokenId
                );

                // Update NFT distributions
                nftDistributions[nftContractAddress][msg.sender].push(tokenId);
            }
        }
    }

    // Function to get the current balance of an NFT pool - is this even needed?
    function getNFTPoolBalance(
        uint256 poolIndex
    ) external view returns (uint256) {
        require(poolIndex < nftPools.length, "Invalid pool index");
        return nftPools[poolIndex].balance;
    }

    // Function to get the total amount distributed to an NFT pool
    function getTotalDistributedToNFTPool(
        address nftPoolAddress
    ) external view returns (uint256) {
        return totalAmountDistributed[nftPoolAddress];
    }

    // Function to get the array of deposited token addresses
    function getDepositedTokens() external view returns (address[] memory) {
        return depositedTokens;
    }

    // Function to get the array of deposited NFT contract addresses
    function getDepositedNFTContracts()
        external
        view
        returns (address[] memory)
    {
        return depositedNFTContracts;
    }

    // Function to check if the contract is paused
    function isPaused() external view returns (bool) {
        return _paused;
    }
}
