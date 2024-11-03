import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
const { parseUnits } = ethers;

describe("Crawdify factory & storage contracts", function () {
    async function deployFactoryAndToken() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const PYUSD = await ethers.getContractFactory("PYUSD");

        const py_USD = await PYUSD.deploy();
        await py_USD.waitForDeployment();

        const pyUSDAddress = await py_USD.getAddress();

        const pyUSDTransfer = await py_USD.transfer(
            otherAccount.address,
            parseUnits("60", "ether")
        );
        await pyUSDTransfer.wait();

        const Crawdify_Factory = await ethers.getContractFactory(
            "Crawdify_Factory"
        );

        const crawdifyFactory = await Crawdify_Factory.deploy(pyUSDAddress);
        await crawdifyFactory.waitForDeployment();

        return { crawdifyFactory, py_USD, pyUSDAddress, owner, otherAccount };
    }

    describe("Correct Deployment Parameters", function () {
        it("sets the PYUSD address as the main address", async function () {
            const {
                crawdifyFactory,
                pyUSDAddress,
                py_USD,
                otherAccount,
                owner,
            } = await loadFixture(deployFactoryAndToken);

            const pyUSDAddressFromFactory =
                await crawdifyFactory.PYUSD_CONTRACT_ADDRESS();

            const ownerPYUSDBalance = await py_USD.balanceOf(owner);
            const otherAccountPYUSDBalance = await py_USD.balanceOf(
                otherAccount
            );

            expect(pyUSDAddressFromFactory).to.equal(pyUSDAddress);
            expect(ownerPYUSDBalance).to.equal(parseUnits("40", "ether"));
            expect(otherAccountPYUSDBalance).to.equal(
                parseUnits("60", "ether")
            );
        });
    });

    describe("Creates a new initiative", function () {
        it("creates a new initiative by deploying a storage contract, supporting & withdrawing", async function () {
            const {
                crawdifyFactory,
                pyUSDAddress,
                py_USD,
                otherAccount,
                owner,
            } = await loadFixture(deployFactoryAndToken);

            await expect(
                crawdifyFactory.createInititive(parseUnits("20", "ether"), "0x")
            ).to.emit(crawdifyFactory, "InitiativeCreated");

            const newInitiative = await crawdifyFactory.createInititive(
                parseUnits("20", "ether"),
                "0x"
            );
            const txReceipt = await newInitiative.wait();
            const eventLog = txReceipt?.logs[0];
            const eventArgs = crawdifyFactory.interface.decodeEventLog(
                "InitiativeCreated",
                eventLog?.data as string,
                eventLog?.topics
            );

            const founderInitiatives =
                await crawdifyFactory.getFounderInitiatives(owner.address);

            expect(eventArgs[3]).to.equal(founderInitiatives[founderInitiatives.length - 1])

            const Crawdify_Storage = await ethers.getContractFactory(
                "Crawdify_Storage"
            );
            const newInitiativeFromAddress = Crawdify_Storage.attach(
                eventArgs[3]
            );
            const initiativeData =
                await newInitiativeFromAddress.getInitiative();

            expect(initiativeData.initiativeGoal).to.equal(
                parseUnits("20", "ether")
            );
            expect(initiativeData.initiativeAmountRaised).to.equal(
                parseUnits("0", "ether")
            );
            expect(initiativeData.initiativeFounder).to.equal(owner.address);
            expect(initiativeData.initiativeMetadata).to.equal("0x");

            expect(
                newInitiativeFromAddress.supportInitiative(
                    parseUnits("10", "ether")
                )
            ).to.be.revertedWithCustomError(
                Crawdify_Storage,
                "YouFoundThisInitiative"
            );

            expect(
                newInitiativeFromAddress
                    .connect(otherAccount)
                    .supportInitiative(parseUnits("0", "ether"))
            ).to.be.revertedWithCustomError(Crawdify_Storage, "InvalidAmount");

            const otherBal = await py_USD.balanceOf(otherAccount.address);

            await py_USD
                .connect(otherAccount)
                .approve(eventArgs[3], parseUnits("50", "ether"));

            const approvedAmountForOtherAddress = await py_USD.allowance(
                otherAccount.address,
                eventArgs[3]
            );

            expect(approvedAmountForOtherAddress).to.equal(
                parseUnits("50", "ether")
            );

            expect(
                await newInitiativeFromAddress
                    .connect(otherAccount)
                    .supportInitiative(parseUnits("10", "ether"))
            ).to.emit(Crawdify_Storage, "InitiativeSupported");

            const initiativeDataAfter =
                await newInitiativeFromAddress.getInitiative();

            expect(initiativeDataAfter.initiativeAmountRaised).to.equal(
                parseUnits("10", "ether")
            );

            // console.log(Number(initiativeDataAfter.initiativeAmountRaised));
        });
    });
});
