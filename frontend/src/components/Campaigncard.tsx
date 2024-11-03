"use client";

import { formatEther, formatUnits, parseUnits } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { crawdifyStorageABI, PYUSD_ABI } from "src/app/utils/abi";

import {
    useAccount,
    useWriteContract,
    useReadContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { useModal } from "./Modalcontext";
import { parseContractError } from "src/app/utils/errors";
import { useRouter } from "next/navigation";
import { useLoader } from "./Loadercontext";

interface CampaignCardProps {
    title: string;
    goal: string;
    initiativeAmountRaised: string;
    description: string;
    initiativeFounder: string;
    initiativeAddress: string;
    id: string;
    imageUrl: number;
}

const Campaigncard: React.FC<CampaignCardProps> = ({
    title,
    goal,
    initiativeAmountRaised,
    description,
    initiativeFounder,
    initiativeAddress,
    id,
    imageUrl,
}) => {
    const { setIsShown, setIcon, setMessage } = useModal();
    const { setIsLoading } = useLoader();
    const account = useAccount();
    const { writeContractAsync } = useWriteContract();
    const [donationAmount, setDonationAmount] = useState("");
    const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null);

    const [PYUSD_ALLOWANCE, setPYUSDAllowance] = useState<
        bigint | null | undefined
    >(null);
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDonationAmount(event.target.value);
    };

    const handleApproval = async (amount: any) => {
        try {
            setIsLoading(true);
            const tx = await writeContractAsync({
                abi: PYUSD_ABI,
                address: `0x${process.env.NEXT_PUBLIC_PYUSD_ETH_SEPOLIA as string}`,
                account: account.address,
                functionName: "approve",
                args: [
                    `0x${String(initiativeAddress).substring(2)}`,
                    parseUnits(amount, 6),
                ],
            });
            if (tx) {
                setApprovalTxHash(tx);
                await refetch();
            }
        } catch (error) {
            setMessage(`ERROR: ${parseContractError(error)}`);
            setIcon("no");
            setIsShown(true);
            setIsLoading(false);
        }
    };

    const handleSupportInitiative = async () => {
        try {
            const result = await writeContractAsync({
                abi: crawdifyStorageABI,
                address: `0x${String(initiativeAddress).substring(2)}`,
                account: account.address,
                functionName: "supportInitiative",
                args: [parseUnits(donationAmount, 6)],
            });

            setMessage(`Successfully supported the campaign`);
            setIcon("yes");
            setIsShown(true);
            setDonationAmount("");
        } catch (error) {
            setMessage(`ERROR: ${parseContractError(error)}`);
            setIcon("no");
            setIsShown(true);
        } finally {
            setIsLoading(false);
            setApprovalTxHash(null);
            await refetch(); // Update allowance after donation
        }
    };

    const handleDonation = async () => {
        try {
            await refetch().then(async () => {
                if (Number(donationAmount) <= 0) {
                    setMessage("Amount must be greater than 0");
                    setIcon("no");
                    setIsShown(true);
                    return;
                }

                const donationAmountBN = parseUnits(donationAmount, 6);
                const currentAllowance = BigInt(PYUSD_ALLOWANCE || 0);

                console.log(currentAllowance);

                if (currentAllowance < donationAmountBN) {
                    // Need approval first
                    await handleApproval(donationAmount);
                } else {
                    // Sufficient allowance, proceed with donation
                    await handleSupportInitiative();
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (approvalTxHash) {
            const checkReceipt = async () => {
                try {
                    const receipt = await refetchTXRec();
                    console.log(receipt);
                    if (receipt) {
                        await handleSupportInitiative();
                    }
                } catch (error) {
                    // console.log("Error checking receipt:", error);
                    setMessage(`Please retry Donation`);
                    setIcon("no");
                    setIsShown(true);
                    return;
                }
            };
            checkReceipt();
        }
    }, [approvalTxHash]);

    const { data: resWaitRec, refetch: refetchTXRec } =
        useWaitForTransactionReceipt({
            hash: `0x${String(approvalTxHash).substring(2)}`,
        });

    const { data } = useReadContract({
        abi: crawdifyStorageABI,
        address: `0x${String(initiativeAddress).substring(2)}`,
        functionName: "getInitiative",
    });

    const { data: pyusd_data, refetch } = useReadContract({
        abi: PYUSD_ABI,
        address: `0x${process.env.NEXT_PUBLIC_PYUSD_ETH_SEPOLIA as string}`,
        functionName: "allowance",
        args: [
            `0x${String(account.address)?.substring(2)}`,
            `0x${String(initiativeAddress)?.substring(2)}`,
        ],
    });

    useEffect(() => {
        // if (pyusd_data != null) {
        setPYUSDAllowance(pyusd_data);
        // }
    }, [pyusd_data]);

    useEffect(() => {
        async function refetchData() {
            await refetch();
        }
        if (data) {
            console.log(data);
            // setCreatorContracts(data);
            // console.log("Creator Contracts: ", data);
            // const campaign = data.filter(
            //     (x) => x.projectDetailsHash == `0x${id}`,
            // );
            // setIdFromContract(campaign[0].id);
        }

        if (pyusd_data == null) {
            refetchData();
        }
    }, [data]);

    const navigateToNextPage = (initiativeAddress: any) => {
        router.push(`/explore/${initiativeAddress}`);
        // console.log(creator)
        // console.log(idFromContract)
    };

    return (
        <section
            onClick={() => navigateToNextPage(initiativeAddress)}
            className="flex flex-col rounded-lg justify-start cursor-pointer space-y-3 max-w-96 items-start mx-auto p-3 glass-background hover:opacity-90"
        >
            <img src={`./static/${imageUrl}.jpeg`} alt="" className="w-full" />

            {account.isConnected ? (
                <>
                    <p className="font-bold">{title}</p>
                    <div className="w-full bg-[#023430] rounded-full h-[0.35rem]">
                        <div
                            className="bg-[#bce26b] h-full rounded-full"
                            style={{
                                width: `${(Number(formatUnits(initiativeAmountRaised, 6)) / Number(formatUnits(goal, 6))) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <p className="font-bold text-left">
                        {Number(formatUnits(initiativeAmountRaised, 6))} PYUSD
                        raised of {Number(formatUnits(goal, 6))} PYUSD
                    </p>
                    {initiativeFounder != account.address ? (
                        <>
                            <input
                                type="number"
                                className="rounded-lg px-3 py-2 w-full appearance-none outline-none border-none glass-background"
                                placeholder="0.1"
                                min={0}
                                value={donationAmount}
                                onChange={handleInputChange}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // donateToCampaign(initiativeAddress);
                                    handleDonation();
                                }}
                                className="rounded-lg w-full flex justify-center items-center px-5 py-2 font-bold custom-gradient"
                            >
                                Donate
                            </button>
                        </>
                    ) : (
                        ""
                    )}
                </>
            ) : (
                <div>
                    <p className="text-lg font-bold">Connect Wallet</p>
                </div>
            )}
        </section>
    );
};

export default Campaigncard;
