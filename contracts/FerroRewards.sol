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

    // Define the airdrop parameters
    uint256 public totalAirdropCount;

    // total nft supply
    uint256 public totalIronNFTs = 24680;
    uint256 public totalNickelNFTs = 6789;
    uint256 public totalCobaltNFTs = 2345;

    uint256 private immutable _precisionFactor = 10000;

    // Events

    // Event to log when the contract is paused
    event PausedContract(address account);

    // Event to log when the contract is unpaused
    event UnpausedContract(address account);

    mapping(address => mapping(address => uint256)) public rewardsBalance;
    uint256 private constant _IronPercentage = 5000;
    uint256 private constant _NickelPercentage = 3000;
    uint256 private constant _CobaltPercentage = 2000;

    mapping(uint256 => address) public addresses;
    mapping(uint256 => uint256) public ironAmounts;
    mapping(uint256 => uint256) public nickelAmounts;
    mapping(uint256 => uint256) public cobaltAmounts;
    uint256 currentIndex = 0;

    // Maybe add events for airdrops?

    // Mappings to keep track of token & NFT distributions
    mapping(address => uint256) public totalTokenDistribution;

    // Array to store unique token & NFT contract addresses deposited by the owner
    address[] public depositedTokens;

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

    // Receive function to allow the contract to receives Native Currency
    receive() external payable {}

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
        tokenDistribution(amount, tokenAddress);
    }

    // Function to distribute tokens to NFT pools based on NFT ownership
    function tokenDistribution(
        uint256 amount,
        address tokenAddress
    ) internal whenNotPaused {
        require(amount > 0, "Amount must be greater than zero");

        uint256 ironAllocation = (amount * _IronPercentage) / 10000;
        uint256 nickelAllocation = (amount * _NickelPercentage) / 10000;
        uint256 cobaltAllocation = (amount * _CobaltPercentage) / 10000;

        rewardsBalance[ironNFTContract][tokenAddress] += ironAllocation;
        rewardsBalance[nickelNFTContract][tokenAddress] += nickelAllocation;
        rewardsBalance[cobaltNFTContract][tokenAddress] += cobaltAllocation;
        // Check if the total distributed amount matches the expected total allocation
        uint256 totalAllocation = ironAllocation +
            nickelAllocation +
            cobaltAllocation;
        require(
            totalAllocation <= amount,
            "Total distribution does not match allocations"
        );
    }

    // Airdrop tokens
    function airdropTokens() external onlyOwner whenNotPaused {
        require(depositedTokens.length > 0, "No tokens available for airdrop");

        // Iterate through the deposited tokens
        for (
            uint256 tokenIndex = 0;
            tokenIndex < depositedTokens.length;
            tokenIndex++
        ) {
            address tokenAddress = depositedTokens[tokenIndex];

            // Ensure there are tokens to distribute
            uint256 rewardBalanceIron = rewardsBalance[ironNFTContract][
                tokenAddress
            ];
            uint256 rewardBalanceNickel = rewardsBalance[nickelNFTContract][
                tokenAddress
            ];
            uint256 rewardBalanceCobalt = rewardsBalance[cobaltNFTContract][
                tokenAddress
            ];

            require(
                rewardBalanceIron > 0 ||
                    rewardBalanceNickel > 0 ||
                    rewardBalanceCobalt > 0,
                "Too low balance"
            );

            uint256 airdropPerIron = (rewardBalanceIron / totalIronNFTs) /
                totalAirdropCount;
            uint256 airdropPerNickel = (rewardBalanceNickel / totalNickelNFTs) /
                totalAirdropCount;
            uint256 airdropPerCobalt = (rewardBalanceCobalt / totalCobaltNFTs) /
                totalAirdropCount;

            // calculate airdrops

            // Iterate through the NFT pools and their respective amounts
            for (uint256 i = 0; i <= currentIndex; i++) {
                address recipient = addresses[i];
                uint256 ironNFTs = ironAmounts[i];
                uint256 nickelNFTs = nickelAmounts[i];
                uint256 cobaltNFTs = cobaltAmounts[i];

                // Calculate the distribution amount for each NFT tier
                uint256 ironDistribution = (airdropPerIron * ironNFTs);
                uint256 nickelDistribution = (airdropPerNickel * nickelNFTs);
                uint256 cobaltDistribution = (airdropPerCobalt * cobaltNFTs);

                uint256 totalDistribution = ironDistribution +
                    nickelDistribution +
                    cobaltDistribution;

                // Check if the recipient address is not the zero address before transferring tokens
                if (recipient != address(0)) {
                    IERC20(tokenAddress).transfer(recipient, totalDistribution);
                }
            }
        }
    }

    // Update the recipient list
    function updateRecipients(
        address[] memory _recipientAddresses,
        uint256[] memory _ironNFTs,
        uint256[] memory _nickelNFTs,
        uint256[] memory _cobaltNFTs
    ) external onlyOwner {
        require(
            _recipientAddresses.length == _ironNFTs.length &&
                _recipientAddresses.length == _nickelNFTs.length &&
                _recipientAddresses.length == _cobaltNFTs.length,
            "Number of addresses and NFTs should match."
        );
        require(
            _recipientAddresses.length > 0,
            "There are no recipients to update."
        );

        // Loop through the provided recipient addresses
        for (uint256 i = 0; i < _recipientAddresses.length; i++) {
            address recipient = _recipientAddresses[i];

            // Update the NFT ownership mappings with the current index
            addresses[currentIndex] = recipient;
            ironAmounts[currentIndex] = _ironNFTs[i];
            nickelAmounts[currentIndex] = _nickelNFTs[i];
            cobaltAmounts[currentIndex] = _cobaltNFTs[i];

            // Increment the current index
            currentIndex++;
        }
    }

    // Update the total airdrop count
    function updateTotalAirdropCount(
        uint256 _totalAirdropCount
    ) external onlyOwner {
        // Ensure the interval is not zero to avoid division by zero
        require(
            _totalAirdropCount > 0,
            "Airdrop interval must be greater than zero"
        );

        // Update the totalAirdropCount state variable
        totalAirdropCount = _totalAirdropCount;
    }

    // Function to get the array of deposited token addresses
    function getDepositedTokens() external view returns (address[] memory) {
        return depositedTokens;
    }
}
