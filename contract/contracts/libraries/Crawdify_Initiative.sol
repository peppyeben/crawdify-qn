// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library Crawdify_Initiative {
    struct Initiative {
        uint createdAt;
        address initiativeFounder;
        uint initiativeGoal;
        uint initiativeAmountRaised;
        bytes initiativeMetadata;
    }

    function supportInitiative(
        Initiative storage _initiative,
        uint _amount
    ) internal {
        _initiative.initiativeAmountRaised = _initiative
            .initiativeAmountRaised += _amount;
    }
}
