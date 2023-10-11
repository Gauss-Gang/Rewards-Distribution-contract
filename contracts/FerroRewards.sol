// SPDX-License-Identifier: UNLICENSED
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

    bool public _paused;

    // Events

    // Event to log when the contract is paused
    event PausedContract(address account);

    // Event to log when the contract is unpaused
    event UnpausedContract(address account);

    /* Testing:

    mapping(address => mapping(address => uint256)) public rewardsBalance;
    uint256 private constant _IronPercentage = 5000;
    uint256 private constant _NickelPercentage = 3000;
    uint256 private constant _CobaltPercentage = 2000;
    
    mapping(uint256 => address) public addresses;
    mapping(uint256 => uint256) public amounts;
    uint256 currentIndex = 50;
*/

    NFTPool[] public nftPools;

    // Maybe add events for airdrops?


    // Mappings to keep track of token & NFT distributions
    mapping(address => uint256) public totalTokenDistribution;
    

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
    }

    // Pause Token Trading and Transfers
    function pause() public onlyOwner {
        super._pause();
    }

    // Unpause Token Trading and Transfers
    function unpause() public onlyOwner {
        super._unpause();
    }

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

        // Call NFT distribution for all NFT pools
        tokenDistribution(amount);
    }

    // Function to distribute tokens to NFT pools based on NFT ownership
    function tokenDistribution(uint256 amount) internal whenNotPaused {
        require(amount > 0, "Amount must be greater than zero");

        uint256 totalAllocation = 0; // Total allocation for the three NFT pools

        for (uint256 i = 0; i < nftPools.length; i++) {
            uint256 allocation;
            if (i == 0) {
                allocation = (amount * _IronPercentage) / 10000;
            } else if (i == 1) {
                allocation = (amount * _NickelPercentage) / 10000;
            } else if (i == 2) {
                allocation = (amount * _CobaltPercentage) / 10000;
            }

            totalAllocation += allocation; // Update the total allocation

            nftPools[i].balance += allocation;

            // Update the rewards balance mapping for each NFT contract address
            rewardsBalance[address(nftPools[i].nftContract)][
                tokenAddress
            ] += allocation;
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
                    // Update totalTokenDistribution for this token
                    totalTokenDistribution[tokenAddress] += nftPoolBalance;
                }
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
