export const crawdifyFactoryABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_PYUSD_ADDRESS",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "initiativeGoal",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "foundBy",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "initiativeAddress",
                type: "address",
            },
        ],
        name: "InitiativeCreated",
        type: "event",
    },
    {
        inputs: [],
        name: "PYUSD_CONTRACT_ADDRESS",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_initiativeGoal",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "_initiativeMetadata",
                type: "bytes",
            },
        ],
        name: "createInititive",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "founder",
                type: "address",
            },
        ],
        name: "getFounderInitiatives",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export const crawdifyStorageABI = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_initiativeGoal",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "_initiativeMetadata",
                type: "bytes",
            },
            {
                internalType: "address",
                name: "_initiativeFounder",
                type: "address",
            },
            {
                internalType: "address",
                name: "_PYUSD_ADDRESS",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "InitiativeBalanceNotEnough",
        type: "error",
    },
    {
        inputs: [],
        name: "InitiativeGoalReached",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidAmount",
        type: "error",
    },
    {
        inputs: [],
        name: "TokenTransferFailed",
        type: "error",
    },
    {
        inputs: [],
        name: "YouDidNotFindThisInitiative",
        type: "error",
    },
    {
        inputs: [],
        name: "YouFoundThisInitiative",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "supportedAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amountSupportedWith",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "supportedBy",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "foundBy",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "initiativeAddress",
                type: "address",
            },
        ],
        name: "InitiativeSupported",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "withdrawnAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amountWithdrawn",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "initiativeAddress",
                type: "address",
            },
        ],
        name: "WithdrawnFromInitiative",
        type: "event",
    },
    {
        inputs: [],
        name: "PYUSD_CONTRACT_ADDRESS",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getInitiative",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "createdAt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "initiativeFounder",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "initiativeGoal",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "initiativeAmountRaised",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes",
                        name: "initiativeMetadata",
                        type: "bytes",
                    },
                    {
                        internalType: "address",
                        name: "initiativeAddress",
                        type: "address",
                    },
                ],
                internalType: "struct Crawdify_Initiative.Initiative",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "supportInitiative",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const PYUSD_ABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "allowance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
            },
        ],
        name: "ERC20InsufficientAllowance",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
            },
        ],
        name: "ERC20InsufficientBalance",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "approver",
                type: "address",
            },
        ],
        name: "ERC20InvalidApprover",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
        ],
        name: "ERC20InvalidReceiver",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "ERC20InvalidSender",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "ERC20InvalidSpender",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "allowance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
