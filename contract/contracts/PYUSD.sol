// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PYUSD is ERC20("PYUSD", "PYUSD") {
    constructor() {
        _mint(msg.sender, 100 * 10 ** 18);
    }
}
