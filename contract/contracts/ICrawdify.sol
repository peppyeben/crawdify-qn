// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface ICrawdify {
    event InitiativeCreated(
        uint createdAt,
        uint initiativeGoal,
        address indexed foundBy,
        address indexed initiativeAddress
    );

    event InitiativeSupported(
        uint supportedAt,
        uint amountSupportedWith,
        address indexed supportedBy,
        address indexed foundBy,
        address indexed initiativeAddress
    );

    event WithdrawnFromInitiative(
        uint withdrawnAt,
        uint amountWithdrawn,
        address indexed initiativeAddress
    );
}
