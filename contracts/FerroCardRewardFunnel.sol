// SPDX-License-Identifier: MIT
pragma solidity =0.8.19;

import {IERC20} from "./libraries/interfaces/IERC20.sol";
import {IERC721} from "./libraries/interfaces/IERC721.sol";
import {IERC721Enumerable} from "./libraries/interfaces/IERC721Enumerable.sol";
import {ERC20} from "./libraries/token/ERC20.sol";

import {ReentrancyGuard} from "./libraries/utils/ReentrancyGuard.sol";
import {Pausable} from "./libraries/security/Pausable.sol";
import {Ownable} from "./libraries/access/Ownable.sol";
import {BatchTransfer} from "./libraries/utils/BatchTransfer.sol";
import {Math} from "./libraries/utils/Math.sol";


contract FerroCardRewardFunnel is Ownable, Pausable, ReentrancyGuard {
    
    // State variables
    address public ironNFTContract;
    address public nickelNFTContract;
    address public cobaltNFTContract;

    // Total Supply for each NFT Collection
    uint256 public totalIronNFTs; // Final Supply = 24680
    uint256 public totalNickelNFTs; // Final Supply = 6789
    uint256 public totalCobaltNFTs; // Final Supply = 2345

    uint256 private immutable _precisionFactor = 100000;

    uint256 private _dripRate = 10; // 0.01% of the total balance each hour
    uint256 private _batchSize = 25;
    
    uint256 private _IronPercentage = 50000;
    uint256 private _NickelPercentage = 30000;
    uint256 private _CobaltPercentage = 20000;

    uint256 currentIndex = 0;

    mapping(address => mapping(address => uint256)) public rewardsBalance;

    mapping(uint256 => address) public addresses;
    mapping(uint256 => uint256) public ironAmounts;
    mapping(uint256 => uint256) public nickelAmounts;
    mapping(uint256 => uint256) public cobaltAmounts;

    // Mappings to keep track of token & NFT distributions
    mapping(address => uint256) public totalTokenDistribution;

    // Array to store unique token & NFT contract addresses deposited by the owner
    address[] public depositedTokens;


    constructor(address _ironNFTContract, address _nickelNFTContract, address _cobaltNFTContract) {
        // Initializing the contract addresses
        ironNFTContract = _ironNFTContract;
        nickelNFTContract = _nickelNFTContract;
        cobaltNFTContract = _cobaltNFTContract;

        // Setting Current Total Supply
        totalIronNFTs = IERC721Enumerable(_ironNFTContract).totalSupply();
        totalNickelNFTs = IERC721Enumerable(_nickelNFTContract).totalSupply();
        totalCobaltNFTs = IERC721Enumerable(_cobaltNFTContract).totalSupply();
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



    // Allows Owner to deposit tokens into the Ferro Reward Funnel
    function depositTokens(uint256 amount, address tokenAddress) external onlyOwner {
        
        require(amount > 0, "Amount must be greater than zero");
        require(tokenAddress != address(0), "Invalid token address");

        IERC20 tokenToDeposit = IERC20(tokenAddress);
        require(tokenToDeposit.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        if (!_hasTokenBeenDeposited(tokenAddress)) {
            depositedTokens.push(tokenAddress);
        }

        uint256 newTotal = tokenToDeposit.balanceOf(address(this));

        // Balance NFT distribution for all NFT pools
        balancePools(newTotal, tokenAddress);
    }


    // Function to balance tokens to NFT pools based on NFT Teir
    function balancePools(uint256 amount, address tokenAddress) internal {
        
        require(amount > 0, "Amount must be greater than zero");

        uint256 ironAllocation = Math.mulDiv(amount, _IronPercentage, _precisionFactor);
        uint256 nickelAllocation = Math.mulDiv(amount, _NickelPercentage, _precisionFactor);
        uint256 cobaltAllocation = Math.mulDiv(amount, _CobaltPercentage, _precisionFactor);

        rewardsBalance[ironNFTContract][tokenAddress] += ironAllocation;
        rewardsBalance[nickelNFTContract][tokenAddress] += nickelAllocation;
        rewardsBalance[cobaltNFTContract][tokenAddress] += cobaltAllocation;
        
        // Check if the total distributed amount matches the expected total allocation
        uint256 totalAllocation = ironAllocation + nickelAllocation + cobaltAllocation;

        require(totalAllocation <= amount, "Total distribution does not match allocations");
    }


    // Airdrop tokens for Iron tier
    function airdropTokensIron(uint batchNum) external onlyOwner whenNotPaused {
        updateTotalSupply();

        require(depositedTokens.length > 0, "No tokens available for airdrop");

        for (uint256 tokenIndex = 0; tokenIndex < depositedTokens.length; tokenIndex++) {
            
            // Ensure there are tokens to distribute
            address tokenAddress = depositedTokens[tokenIndex];
            uint256 rewardBalance = rewardsBalance[ironNFTContract][tokenAddress];
            require(rewardBalance > 0, "Balance too low");

            uint256 totalPerFerroCard = (rewardBalance / totalIronNFTs);
            uint256 airdropPerFerroCard = Math.mulDiv(totalPerFerroCard, _dripRate, _precisionFactor);

            uint batchIndex = 0 + (batchNum * _batchSize);

            // Iterate through the NFT pools and their respective amounts
            for (uint256 i = batchIndex; i <= currentIndex; i++) {
                if(i == batchIndex + _batchSize) {
                    break; // Exit the loop if _batchSize has been processed
                }

                address recipient = addresses[i];
                uint256 nftAmount = ironAmounts[i];

                // Calculate the distribution amount for the current recipient
                uint256 distributionAmount = airdropPerFerroCard * nftAmount;

                // Check if the recipient address is not the zero address before transferring tokens
                if (recipient != address(0) && distributionAmount > 0) {
                    IERC20(tokenAddress).transfer(recipient, distributionAmount);
                    totalTokenDistribution[tokenAddress] += distributionAmount;
                }
            }
        }
    }

    
    // Airdrop tokens for Nickel tier
    function airdropTokensNickel(uint batchNum) external onlyOwner whenNotPaused {
        updateTotalSupply();

        require(depositedTokens.length > 0, "No tokens available for airdrop");

        for (uint256 tokenIndex = 0; tokenIndex < depositedTokens.length; tokenIndex++) {
            
            // Ensure there are tokens to distribute
            address tokenAddress = depositedTokens[tokenIndex];
            uint256 rewardBalance = rewardsBalance[nickelNFTContract][tokenAddress];
            require(rewardBalance > 0, "Balance too low");

            uint256 totalPerFerroCard = (rewardBalance / totalNickelNFTs);
            uint256 airdropPerFerroCard = Math.mulDiv(totalPerFerroCard, _dripRate, _precisionFactor);

            uint batchIndex = 0 + (batchNum * _batchSize);

            // Iterate through the NFT pools and their respective amounts
            for (uint256 i = batchIndex; i <= currentIndex; i++) {
                if(i == batchIndex + _batchSize) {
                    break; // Exit the loop if _batchSize has been processed
                }

                address recipient = addresses[i];
                uint256 nftAmount = nickelAmounts[i];

                // Calculate the distribution amount for the current recipient
                uint256 distributionAmount = airdropPerFerroCard * nftAmount;

                // Check if the recipient address is not the zero address before transferring tokens
                if (recipient != address(0) && distributionAmount > 0) {
                    IERC20(tokenAddress).transfer(recipient, distributionAmount);
                    totalTokenDistribution[tokenAddress] += distributionAmount;
                }
            }
        }
    }

    
    // Airdrop tokens for Cobalt tier
    function airdropTokensCobalt(uint batchNum) external onlyOwner whenNotPaused {
        updateTotalSupply();

        require(depositedTokens.length > 0, "No tokens available for airdrop");

        for (uint256 tokenIndex = 0; tokenIndex < depositedTokens.length; tokenIndex++) {
            
            // Ensure there are tokens to distribute
            address tokenAddress = depositedTokens[tokenIndex];
            uint256 rewardBalance = rewardsBalance[cobaltNFTContract][tokenAddress];
            require(rewardBalance > 0, "Balance too low");

            uint256 totalPerFerroCard = (rewardBalance / totalCobaltNFTs);
            uint256 airdropPerFerroCard = Math.mulDiv(totalPerFerroCard, _dripRate, _precisionFactor);

            uint batchIndex = 0 + (batchNum * _batchSize);

            // Iterate through the NFT pools and their respective amounts
            for (uint256 i = batchIndex; i <= currentIndex; i++) {
                if(i == batchIndex + _batchSize) {
                    break; // Exit the loop if _batchSize has been processed
                }

                address recipient = addresses[i];
                uint256 nftAmount = cobaltAmounts[i];

                // Calculate the distribution amount for the current recipient
                uint256 distributionAmount = airdropPerFerroCard * nftAmount;

                // Check if the recipient address is not the zero address before transferring tokens
                if (recipient != address(0) && distributionAmount > 0) {
                    IERC20(tokenAddress).transfer(recipient, distributionAmount);
                    totalTokenDistribution[tokenAddress] += distributionAmount;
                }
            }
        }
    }


    // Update the recipient list
    function updateRecipients(uint batchNum, address[] memory _recipientAddresses, uint256[] memory _ironNFTs, uint256[] memory _nickelNFTs, uint256[] memory _cobaltNFTs) external onlyOwner {
        
        require(
            _recipientAddresses.length == _ironNFTs.length &&
            _recipientAddresses.length == _nickelNFTs.length &&
            _recipientAddresses.length == _cobaltNFTs.length,
            "Number of addresses and NFTs should match."
        );

        require(_recipientAddresses.length > 0, "There are no recipients to update.");

        currentIndex = _recipientAddresses.length - 1;
        uint batchIndex = 0 + (batchNum * _batchSize);

        // Loop through the provided recipient addresses
        for (uint256 i = batchIndex; i < _recipientAddresses.length; i++) {
            if(i == batchIndex + _batchSize) {
                break; // Exit the loop if _batchSize has been processed
            }
            
            // Update the NFT ownership mappings with the current index
            addresses[i] = _recipientAddresses[i];
            ironAmounts[i] = _ironNFTs[i];
            nickelAmounts[i] = _nickelNFTs[i];
            cobaltAmounts[i] = _cobaltNFTs[i];
        }
    }

    
    // Function to update the Total Supply of the Ferro Cards
    function updateTotalSupply() public onlyOwner() {
        totalIronNFTs = IERC721Enumerable(ironNFTContract).totalSupply();
        totalNickelNFTs = IERC721Enumerable(nickelNFTContract).totalSupply();
        totalCobaltNFTs = IERC721Enumerable(cobaltNFTContract).totalSupply();
    }


    // Function to update the Drip Rate of the Ferro Card Reward Funnel
    function updateDripRate(uint256 newDripRate) public onlyOwner() {
        _dripRate = newDripRate;
    }
    
    
    // Function to update the Drip Rate of the Ferro Card Reward Funnel
    function updateFerroPercentages(uint256 _newIronRate, uint256 _newNickelRate, uint256 _newCobaltRate) public onlyOwner() {
        require(_newIronRate + _newNickelRate + _newCobaltRate == _precisionFactor, "FCRF: Rate does not equal precision factor");
        _IronPercentage = _newIronRate;
        _NickelPercentage = _newNickelRate;
        _CobaltPercentage = _newCobaltRate;
    }


    // Function to update the Batch Size of the Ferro Card Reward Funnel
    function updateBatchSize(uint256 newBatchSize) public onlyOwner() {
        _batchSize = newBatchSize;
    }


    // Function to get the array of deposited token addresses
    function getDepositedTokens() external view returns (address[] memory) {
        return depositedTokens;
    }


    // Function to get the Total Amount of a specific Token Airdroped to all Ferro Holders
    function getTotalAirdroped(address token) external view returns (uint256) {
        return totalTokenDistribution[token];
    }


    // Function to get the current Amount Per Ferro of a specific Token inside the Ferro Card Reward Funnel
    function getAmountPerFerro(address token) external view returns (uint256,uint256,uint256) {
        uint256 ironRewardBalance = rewardsBalance[ironNFTContract][token];
        uint256 totalPerIron = (ironRewardBalance / totalIronNFTs);
        uint256 airdropPerIron = Math.mulDiv(totalPerIron, _dripRate, _precisionFactor);

        uint256 nickelRewardBalance = rewardsBalance[nickelNFTContract][token];
        uint256 totalPerNickel = (nickelRewardBalance / totalNickelNFTs);
        uint256 airdropPerNickel = Math.mulDiv(totalPerNickel, _dripRate, _precisionFactor);

        uint256 cobaltRewardBalance = rewardsBalance[cobaltNFTContract][token];
        uint256 totalPerCobalt = (cobaltRewardBalance / totalIronNFTs);
        uint256 airdropPerCobalt = Math.mulDiv(totalPerCobalt, _dripRate, _precisionFactor);

        return (airdropPerIron, airdropPerNickel, airdropPerCobalt);
    }


    // Function to get the current balance of a specific Token inside the Ferro Card Reward Funnel
    function getRewardsBalance(address token) external view returns (uint256,uint256,uint256) {
        uint256 ironRewardBalance = rewardsBalance[ironNFTContract][token];
        uint256 nickelRewardBalance = rewardsBalance[nickelNFTContract][token];
        uint256 cobaltRewardBalance = rewardsBalance[cobaltNFTContract][token];
        return (ironRewardBalance, nickelRewardBalance, cobaltRewardBalance);
    }


    // Internal Function to check if a token is already deposited
    function _hasTokenBeenDeposited(address tokenAddress) internal view returns (bool) {
        for (uint256 i = 0; i < depositedTokens.length; i++) {
            if (depositedTokens[i] == tokenAddress) {
                return true;
            }
        }
        return false;
    }


    /* Withdrawl any ERC20 Token that are accidentally sent to this contract
            WARNING:    Interacting with unsafe tokens or smart contracts can 
                        result in stolen private keys, loss of funds, and drained
                        wallets. Use this function with trusted Tokens/Contracts only
    */
    function withdrawERC20Amount(address tokenAddress, address recoveryWallet, uint256 amount) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > amount, "Balance too low to transfer amount");

        token.transfer(recoveryWallet, amount);
    }


    // Contract Owner can withdraw any Native sent accidentally
    function nativeRecover(address recoveryWallet) external onlyOwner() {
        payable(recoveryWallet).transfer(address(this).balance);
    }
}
