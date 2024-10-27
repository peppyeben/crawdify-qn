import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CrawdifyModule = buildModule("CrawdifyModule", (m) => {
    const crawdify = m.contract("Crawdify_Factory", [
        "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
    ]);

    return { crawdify };
});

module.exports = CrawdifyModule;
