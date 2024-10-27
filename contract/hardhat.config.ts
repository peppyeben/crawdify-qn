import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const deploymentKey = process.env.PRIVATE_KEY as string;

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.27",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        ethereumSepolia: {
            url: process.env.ALCHEMY_API,
            accounts: [deploymentKey],
        },
    },
};

export default config;
