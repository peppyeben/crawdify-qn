// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../ICrawdify.sol";
import "../libraries/Errors.sol";
import "../libraries/Crawdify_Initiative.sol";

contract Crawdify_Storage {
    using Crawdify_Initiative for Crawdify_Initiative.Initiative;

    address public PYUSD_CONTRACT_ADDRESS;

    Crawdify_Initiative.Initiative private initiative;

    constructor(
        uint _initiativeGoal,
        bytes memory _initiativeMetadata,
        address _initiativeFounder,
        address _PYUSD_ADDRESS
    ) {
        PYUSD_CONTRACT_ADDRESS = _PYUSD_ADDRESS;

        initiative.initiativeFounder = _initiativeFounder;
        initiative.initiativeGoal = _initiativeGoal;
        initiative.initiativeAmountRaised = 0;
        initiative.initiativeMetadata = _initiativeMetadata;
        initiative.initiativeAddress = address(this);
    }

    function supportInitiative(uint _amount) external {
        if (msg.sender == initiative.initiativeFounder)
            revert Errors.YouFoundThisInitiative();

        if (_amount == 0) revert Errors.InvalidAmount();

        uint remainderAmount = initiative.initiativeGoal -
            initiative.initiativeAmountRaised;

        if (remainderAmount == 0) revert Errors.InitiativeGoalReached();

        uint amountToTransfer = 0;

        if (_amount > remainderAmount) {
            amountToTransfer = remainderAmount;
        } else {
            amountToTransfer = _amount;
        }

        bool success = IERC20(PYUSD_CONTRACT_ADDRESS).transferFrom(
            msg.sender,
            address(this),
            amountToTransfer
        );

        if (!success) revert Errors.TokenTransferFailed();

        initiative.supportInitiative(amountToTransfer);

        emit ICrawdify.InitiativeSupported(
            block.timestamp,
            amountToTransfer,
            msg.sender,
            initiative.initiativeFounder,
            address(this)
        );
    }

    function withdraw(uint _amount) external {
        if (msg.sender != initiative.initiativeFounder)
            revert Errors.YouDidNotFindThisInitiative();

        uint initiativeBalance = IERC20(PYUSD_CONTRACT_ADDRESS).balanceOf(
            address(this)
        );

        if (_amount == 0) revert Errors.InvalidAmount();

        if (_amount > initiativeBalance)
            revert Errors.InitiativeBalanceNotEnough();

        bool success = IERC20(PYUSD_CONTRACT_ADDRESS).transfer(
            msg.sender,
            _amount
        );
        if (!success) revert Errors.TokenTransferFailed();

        emit ICrawdify.WithdrawnFromInitiative(
            block.timestamp,
            _amount,
            address(this)
        );
    }

    function getInitiative()
        external
        view
        returns (Crawdify_Initiative.Initiative memory)
    {
        return initiative;
    }
}
