const mongoose = require("mongoose");
const BigNumber = require("bignumber.js");
const { ethers } = require("ethers");
const { isAddress } = ethers;

const CrawdifyInitiativeSchema = new mongoose.Schema({
    title: {
        type: "string",
        required: [true, "Must provide Initiative title"],
        trim: true,
        minlength: [5, "Initiative title cannot be less than 5 characters"],
        maxlength: [55, "Initiative title cannot be more than 55 characters"],
    },
    user_address: {
        type: "string",
        required: [true, "Must provide Useraddress"],
        trim: true,
        validate: {
            validator: function (value) {
                return isAddress(value);
            },
            message: "Invalid Ethereum address for the user",
        },    },
    description: {
        type: "string",
        required: [true, "Must provide description"],
        trim: true,
        minlength: [30, "Initiative description cannot be less than 30 characters"],
        maxlength: [250, "Initiative description cannot be more than 250 characters"],
    },
    goal: {
        type: String,
        required: [true, "Must provide goal"],
        validate: {
            validator: function (v) {
                const bigNumberValue = new BigNumber(v);
                console.log(bigNumberValue);
                return bigNumberValue.isGreaterThanOrEqualTo(
                    new BigNumber("1000000")
                );
            },
            message: "Goal must be at least 1 PYUSD (1000000 wei)",
        },
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    contract_address: {
        type: "string",
        validate: {
            validator: function (value) {
                return isAddress(value);
            },
            message: "Invalid Ethereum address for the contract",
        },
    },
});

module.exports = mongoose.model("CrawdifyInitiative", CrawdifyInitiativeSchema);
