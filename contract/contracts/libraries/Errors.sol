// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library Errors {
    error YouFoundThisInitiative();
    error YouDidNotFindThisInitiative();
    error InitiativeBalanceNotEnough();
    error InitiativeGoalReached();
    error InvalidAmount();
    error TokenTransferFailed();
}
