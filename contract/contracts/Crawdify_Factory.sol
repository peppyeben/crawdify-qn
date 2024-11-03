// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./storage/Crawdify_Storage.sol";
import "./ICrawdify.sol";

contract Crawdify_Factory {
    address public PYUSD_CONTRACT_ADDRESS;
    mapping(address => address[]) private founderInitiatives;

    constructor(address _PYUSD_ADDRESS) {
        PYUSD_CONTRACT_ADDRESS = _PYUSD_ADDRESS;
    }

    function createInititive(
        uint _initiativeGoal,
        bytes memory _initiativeMetadata
    ) public {
        Crawdify_Storage crawdifyStorage = new Crawdify_Storage(
            _initiativeGoal,
            _initiativeMetadata,
            msg.sender,
            PYUSD_CONTRACT_ADDRESS
        );

        founderInitiatives[msg.sender].push(address(crawdifyStorage));

        emit ICrawdify.InitiativeCreated(
            block.timestamp,
            _initiativeGoal,
            msg.sender,
            address(crawdifyStorage)
        );
    }

    function getFounderInitiatives(
        address founder
    ) public view returns (address[] memory) {
        return founderInitiatives[founder];
    }
}
