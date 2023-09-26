// SPDX-License-Identifier: MIT
pragma solidity =0.8.19;

import {ERC20} from "./libraries/token/ERC20.sol";
import {IERC20} from "./libraries/interfaces/IERC20.sol";
import {Ownable} from "./libraries/access/Ownable.sol";
import {ReentrancyGuard} from "./libraries/utils/ReentrancyGuard.sol";
import {Math} from "./libraries/utils/Math.sol";


/**
 * Ferro Snapshot Contract
*/
contract FerroSnapshot is Ownable, ReentrancyGuard {

}