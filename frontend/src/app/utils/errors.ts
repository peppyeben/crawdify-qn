// Mapping error signatures to more readable messages
const errorMessages: any = {
    AlreadyMember: "You are already a member of this campaign.",
    AddressExistsAsMember: "This address is already registered as a member.",
    NotAMember: "You are not recognized as a member. Proceed to Profile Page.",
    AmountCannotBeZero:
        "The amount cannot be zero. Please enter a valid amount.",
    InvalidDate: "The provided date is invalid.",
    InvalidCampaignID: "The campaign ID provided is not valid.",
    NoValidCampaigns: "There are no valid campaigns available.",
    CampaignOwner:
        "You are the owner of this campaign and cannot perform this action.",
    NotCampaignOwner: "Only the campaign owner can perform this action.",
    CampaignEnded: "The campaign has already ended.",
    CampaignNotEnded: "The campaign is still active and cannot be closed yet.",
    CampaignGoalReached: "The campaign has already reached its goal.",
    CampaignPaused: "The campaign is currently paused.",
    NoCampaignForAddress: "There is no campaign associated with this address.",
    ThiefDeyYourEye: "Suspicious behavior detected! Action not allowed.",
    InvalidAmount: "The amount you entered is invalid.",
    WithdrawFailed: "Failed to withdraw funds. Please try again.",
    NotADonor: "Only donors are allowed to perform this action.",
    InsufficientFunds:
        "The total cost of executing this transaction exceeds the balance of the account. Please ensure you have enough ETH to cover the transaction cost.",
    UserRejected:
        "The transaction request was rejected by the user. Please try again.",

    // Adding signature-based error handling
    "0x356680b7":
        "The total cost of executing this transaction exceeds the balance of the account. Please ensure you have enough ETH & PYUSD to cover the transaction cost.",
};

export const parseContractError = (error: any) => {
    const errorString = error.message || error.toString();

    if (errorString.includes("insufficient funds for gas * price + value")) {
        return errorMessages.InsufficientFunds;
    }

    if (errorString.includes("User denied transaction signature")) {
        return errorMessages.UserRejected;
    }

    const matchedError = errorString.match(/\b[A-Za-z]+\(\)/);

    if (matchedError) {
        const errorName = matchedError[0].replace("()", "");
        if (errorMessages[errorName]) {
            return errorMessages[errorName];
        }
    }

    // Check for error signatures
    const signatureMatch = errorString.match(/0x[0-9a-fA-F]{8}/);
    if (signatureMatch && errorMessages[signatureMatch[0]]) {
        return errorMessages[signatureMatch[0]];
    }

    return "An unknown error occurred. Please try again.";
};
