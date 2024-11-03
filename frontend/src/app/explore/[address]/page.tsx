"use client";

import { background } from "@coinbase/onchainkit/theme";
import axios from "axios";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { crawdifyStorageABI, PYUSD_ABI } from "src/app/utils/abi";
import { parseContractError } from "src/app/utils/errors";
import { useLoader } from "src/components/Loadercontext";
import { useModal } from "src/components/Modalcontext";
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import Link from "next/link";

interface CampaignMetadata {
    title: string;
    description: string;
}

const ExploreCampaign = ({ params }: { params: { address: string } }) => {
    const { address } = params;
    const account = useAccount();
    const { setIsShown, setIcon, setMessage } = useModal();
    const { setIsLoading } = useLoader();
    const { writeContractAsync } = useWriteContract();

    const [isValid, setIsValid] = useState(false);
    const [campaignMetadata, setCampaignMetadata] = useState<
        CampaignMetadata[] | []
    >([]);
    const [imageUrl, setImageUrl] = useState(1);

    const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null);
    const [isApprovalComplete, setIsApprovalComplete] = useState(false);
    const [PYUSD_ALLOWANCE, setPYUSDAllowance] = useState<
        bigint | null | undefined
    >(null);

    const [donationAmount, setDonationAmount] = useState("");
    const [claimAmount, setClaimAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDonationAmount(event.target.value);
    };

    const handleClaimInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setClaimAmount(event.target.value);
    };

    const handleWithdrawInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setWithdrawAmount(event.target.value);
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
                    `0x${String(campaignData?.initiativeAddress).substring(2)}`,
                    parseUnits(amount, 6),
                ],
            });
            if (tx) {
                setApprovalTxHash(tx);
            }
        } catch (error) {
            setMessage(`ERROR: ${parseContractError(error)}`);
            setIcon("no");
            setIsShown(true);
            setIsLoading(false);
            setApprovalTxHash(null);
        }
    };

    const handleSupportInitiative = async () => {
        try {
            setIsLoading(true);
            const result = await writeContractAsync({
                abi: crawdifyStorageABI,
                address: `0x${String(campaignData?.initiativeAddress).substring(2)}`,
                account: account.address,
                functionName: "supportInitiative",
                args: [parseUnits(donationAmount, 6)],
            });

            setMessage(`Successfully supported the campaign`);
            setIcon("yes");
            setIsShown(true);
            setDonationAmount("");
            await refetchPYUSDData();
        } catch (error) {
            setMessage(`ERROR: ${parseContractError(error)}`);
            setIcon("no");
            setIsShown(true);
        } finally {
            setIsLoading(false);
            setApprovalTxHash(null);
            setIsApprovalComplete(false);
        }
    };

    const handleDonation = async () => {
        try {
            if (Number(donationAmount) <= 0) {
                setMessage("Amount must be greater than 0");
                setIcon("no");
                setIsShown(true);
                return;
            }

            setIsLoading(true);
            await refetchPYUSDData();
            const donationAmountBN = parseUnits(donationAmount, 6);
            const currentAllowance = BigInt(PYUSD_ALLOWANCE || 0);

            if (currentAllowance < donationAmountBN) {
                // Need approval first
                await handleApproval(donationAmount);
            } else {
                // Sufficient allowance, proceed with donation
                await handleSupportInitiative();
            }
        } catch (error) {
            console.error("Donation error:", error);
            setMessage(`ERROR: Transaction failed`);
            setIcon("no");
            setIsShown(true);
            setIsLoading(false);
        }
    };

    // Watch for approval transaction receipt
    const { data: approvalReceipt } = useWaitForTransactionReceipt({
        hash: approvalTxHash
            ? `0x${String(approvalTxHash).substring(2)}`
            : undefined,
    });

    // Handle approval completion
    useEffect(() => {
        if (approvalReceipt && !isApprovalComplete) {
            setIsApprovalComplete(true);
            refetchPYUSDData()
                .then(() => {
                    handleSupportInitiative();
                })
                .catch((error) => {
                    setMessage(
                        `ERROR: Failed to process donation after approval`,
                    );
                    setIcon("no");
                    setIsShown(true);
                    setIsLoading(false);
                });
        }
    }, [approvalReceipt]);

    const claimFundsFromCampaign = async () => {
        setIsLoading(true);
        try {
            const result = await writeContractAsync({
                abi: crawdifyStorageABI,
                address: `0x${String(campaignData?.initiativeAddress).substring(2)}`,
                account: account.address,
                functionName: "withdraw",
                args: [parseUnits(claimAmount, 6)],
            });

            if (result) {
                setMessage(`Campaign funds successfully claimed to wallet.`);
                setIcon("yes");
                setIsShown(true);
                setClaimAmount("");
            }
        } catch (error) {
            console.log(error);
            setMessage(`ERROR: ${parseContractError(error)}`);
            setIcon("no");
            setIsShown(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Rest of your existing code (useEffects, fetch functions, and JSX) remains the same...

    useEffect(() => {
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        const match = address.match(ethAddressRegex);
        if (match) {
            const [ethAddress] = match;
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [address]);

    useEffect(() => {
        setImageUrl(Math.floor(Math.random() * 6) + 1);
    }, []);

    const {
        data: campaignData,
        isError,
        isLoading,
        refetch,
    } = useReadContract({
        abi: crawdifyStorageABI,
        address: `0x${String(address).substring(2)}`,
        functionName: "getInitiative",
        account: account.address,
    });

    const { data: pyusd_data, refetch: refetchPYUSDData } = useReadContract({
        abi: PYUSD_ABI,
        address: `0x${process.env.NEXT_PUBLIC_PYUSD_ETH_SEPOLIA as string}`,
        functionName: "allowance",
        args: [
            `0x${String(account.address)?.substring(2)}`,
            `0x${String(address)?.substring(2)}`,
        ],
    });

    useEffect(() => {
        setPYUSDAllowance(pyusd_data);
    }, [pyusd_data]);

    const SCALE_FACTOR = 1000000n;

    const fetchCampaignDetails = async () => {
        if (campaignData) {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_DB_URL as string}/store`,
                    {
                        params: {
                            id: campaignData.initiativeMetadata.substring(2),
                        },
                        headers: {
                            "Content-Type": "application/json",
                            CrawdifyServer: process.env
                                .NEXT_PUBLIC_HEADER_VALUE as string,
                        },
                    },
                );
                const { title, description } = response.data.campaigns[0];
                setCampaignMetadata([{ title, description }]);
            } catch (error) {
                setMessage(`ERROR: ${parseContractError(error)}`);
                setIcon("no");
                setIsShown(true);
            }
        }
    };

    useEffect(() => {
        if (campaignData) {
            fetchCampaignDetails();
        }
    }, [campaignData]);

    useEffect(() => {
        if (isValid) {
            refetch();
        }
    }, [isValid]);

    // Your existing return JSX remains the same...
    return (
        <section className="w-full flex flex-col space-y-3 justify-start items-start px-6 glass-background py-4 rounded-lg">
            {isValid ? (
                campaignData ? (
                    Number(campaignData?.initiativeGoal) > 0 &&
                    campaignMetadata.length > 0 ? (
                        <>
                            <section className="flex w-full space-x-4">
                                <div
                                    className="w-1/2 max-h-[30rem] h-[30rem] bg-cover bg-center rounded-md"
                                    style={{
                                        backgroundImage: `url('../static/${imageUrl}.jpeg')`,
                                    }}
                                ></div>
                                <section className="flex flex-col space-y-3 w-1/2">
                                    <p className="text-3xl font-extrabold">
                                        {campaignMetadata[0].title}
                                    </p>
                                    <section className="p-5 glass-background rounded-md w-full">
                                        <p className="w-full break-words">
                                            {campaignMetadata[0].description}
                                        </p>
                                    </section>
                                    <div className="w-full bg-[#023430] rounded-full h-[0.35rem]">
                                        <div
                                            className="bg-[#bce26b] h-full rounded-full"
                                            style={{
                                                width: `${(Number(formatUnits(campaignData.initiativeAmountRaised, 6)) / Number(formatUnits(campaignData.initiativeGoal, 6))) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="font-bold text-left">
                                        {formatUnits(
                                            String(
                                                campaignData.initiativeAmountRaised,
                                            ),
                                            6,
                                        )}{" "}
                                        PYUSD
                                        <span className="font-normal">
                                            {" "}
                                            raised of{" "}
                                        </span>
                                        <span className="font-bold">
                                            {formatUnits(
                                                String(
                                                    campaignData.initiativeGoal,
                                                ),
                                                6,
                                            )}{" "}
                                            PYUSD
                                        </span>
                                    </p>
                                    <p className="font-bold">
                                        Found by{" "}
                                        {campaignData.initiativeFounder ==
                                        account.address ? (
                                            <span>ME</span>
                                        ) : (
                                            <span>
                                                <Link
                                                    href={`https://sepolia.etherscan.io/address/${campaignData.initiativeFounder}`}
                                                    className="transition-all duration-500 hover:underline"
                                                >
                                                    {`${String(campaignData.initiativeFounder).slice(0, 5)}...${String(campaignData.initiativeFounder).slice(-5)}`}
                                                </Link>
                                            </span>
                                        )}
                                    </p>
                                    {campaignData.initiativeFounder ==
                                    account.address ? (
                                        <>
                                            <section className="flex flex-col space-y-2 justify-center items-center py-3">
                                                <input
                                                    type="number"
                                                    className="rounded-lg px-3 py-2 w-full appearance-none outline-none border-none glass-background"
                                                    placeholder="0.1"
                                                    min={0}
                                                    value={claimAmount}
                                                    onChange={
                                                        handleClaimInputChange
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        claimFundsFromCampaign()
                                                    }
                                                    className="rounded-lg w-full flex justify-center items-center px-5 py-2 font-bold custom-gradient"
                                                >
                                                    Claim funds from campaign
                                                </button>
                                            </section>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="number"
                                                className="rounded-lg px-3 py-2 w-full appearance-none outline-none border-none glass-background"
                                                placeholder="0.1"
                                                min={0}
                                                value={donationAmount}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                onClick={() => handleDonation()}
                                                className="rounded-lg w-full flex justify-center items-center px-5 py-2 font-bold custom-gradient"
                                            >
                                                Donate
                                            </button>{" "}
                                        </>
                                    )}
                                </section>
                            </section>
                        </>
                    ) : (
                        <div className="w-full">
                            <p className="font-bold text-lg text-center">
                                This page doesn't exist yet.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="w-full">
                        <p className="font-bold text-lg text-center">
                            We can't find what you're looking for.
                        </p>
                    </div>
                )
            ) : (
                <div className="w-full">
                    <p className="font-bold text-lg text-center">
                        There's nothing here
                    </p>
                </div>
            )}
        </section>
    );
};

export default ExploreCampaign;

// "use client";

// import { background } from "@coinbase/onchainkit/theme";
// import axios from "axios";
// import { formatEther, formatUnits, parseEther, parseUnits } from "ethers";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { crawdifyStorageABI, PYUSD_ABI } from "src/app/utils/abi";
// import { parseContractError } from "src/app/utils/errors";
// import { useLoader } from "src/components/Loadercontext";
// import { useModal } from "src/components/Modalcontext";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import Link from "next/link";

// interface CampaignMetadata {
//     title: string;
//     description: string;
// }

// const ExploreCampaign = ({ params }: { params: { address: string } }) => {
//     const { address } = params;
//     const account = useAccount();
//     const { setIsShown, setIcon, setMessage } = useModal();
//     const { setIsLoading } = useLoader();
//     const { writeContractAsync } = useWriteContract();

//     const [isValid, setIsValid] = useState(false);
//     const [campaignMetadata, setCampaignMetadata] = useState<
//         CampaignMetadata[] | []
//     >([]);
//     const [imageUrl, setImageUrl] = useState(1);

//     const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null);
//     const [PYUSD_ALLOWANCE, setPYUSDAllowance] = useState<
//         bigint | null | undefined
//     >(null);

//     const [donationAmount, setDonationAmount] = useState("");
//     const [claimAmount, setClaimAmount] = useState("");
//     const [withdrawAmount, setWithdrawAmount] = useState("");

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setDonationAmount(event.target.value);
//     };
//     const handleClaimInputChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         setClaimAmount(event.target.value);
//     };
//     const handleWithdrawInputChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         setWithdrawAmount(event.target.value);
//     };
//     const [userDonationData, setUserDonationData] = useState<bigint | 0>(0);

//     useEffect(() => {
//         const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

//         const match = address.match(ethAddressRegex);
//         console.log(match);
//         if (match) {
//             const [ethAddress] = match;
//             setIsValid(true);
//             console.log(`Valid address: ${ethAddress}`);
//         } else {
//             setIsValid(false);
//             console.error("Invalid format. Expected an Ethereum address");
//         }
//     }, [address]);

//     useEffect(() => {
//         console.log(address);
//         setImageUrl(Math.floor(Math.random() * 6) + 1);
//     }, []);

//     const handleApproval = async (amount: any) => {
//         try {
//             setIsLoading(true);
//             const tx = await writeContractAsync({
//                 abi: PYUSD_ABI,
//                 address: `0x${process.env.NEXT_PUBLIC_PYUSD_ETH_SEPOLIA as string}`,
//                 account: account.address,
//                 functionName: "approve",
//                 args: [
//                     `0x${String(campaignData?.initiativeAddress).substring(2)}`,
//                     parseUnits(amount, 6),
//                 ],
//             });
//             if (tx) {
//                 setApprovalTxHash(tx);
//                 await refetchPYUSDData();
//             }
//         } catch (error) {
//             setMessage(`ERROR: ${parseContractError(error)}`);
//             setIcon("no");
//             setIsShown(true);
//             setIsLoading(false);
//         }
//     };

//     const handleSupportInitiative = async () => {
//         try {
//             const result = await writeContractAsync({
//                 abi: crawdifyStorageABI,
//                 address: `0x${String(campaignData?.initiativeAddress).substring(2)}`,
//                 account: account.address,
//                 functionName: "supportInitiative",
//                 args: [parseUnits(donationAmount, 6)],
//             });

//             setMessage(`Successfully supported the campaign`);
//             setIcon("yes");
//             setIsShown(true);
//             setDonationAmount("");
//         } catch (error) {
//             setMessage(`ERROR: ${parseContractError(error)}`);
//             setIcon("no");
//             setIsShown(true);
//         } finally {
//             setIsLoading(false);
//             setApprovalTxHash(null);
//             await refetchPYUSDData(); // Update allowance after donation
//         }
//     };

//     const handleDonation = async () => {
//         setIsLoading(true);
//         try {
//             await refetchPYUSDData().then(async () => {
//                 if (Number(donationAmount) <= 0) {
//                     setMessage("Amount must be greater than 0");
//                     setIcon("no");
//                     setIsShown(true);
//                     setIsLoading(false);
//                     return;
//                 }

//                 const donationAmountBN = parseUnits(donationAmount, 6);
//                 const currentAllowance = BigInt(PYUSD_ALLOWANCE || 0);

//                 console.log(currentAllowance);

//                 if (currentAllowance < donationAmountBN) {
//                     // Need approval first
//                     await handleApproval(donationAmount);
//                 } else {
//                     // Sufficient allowance, proceed with donation
//                     await handleSupportInitiative();
//                 }
//             });
//         } catch (error) {
//             console.log(error);
//             setIsLoading(false);
//         }
//     };

//     const {
//         data: campaignData,
//         isError,
//         isLoading,
//         refetch,
//     } = useReadContract({
//         abi: crawdifyStorageABI,
//         address: `0x${String(address).substring(2)}`,
//         functionName: "getInitiative",
//         account: account.address,
//     });

//     useEffect(() => {
//         if (isValid) {
//             refetch();
//         }
//     }, [isValid]);

//     const { data: pyusd_data, refetch: refetchPYUSDData } = useReadContract({
//         abi: PYUSD_ABI,
//         address: `0x${process.env.NEXT_PUBLIC_PYUSD_ETH_SEPOLIA as string}`,
//         functionName: "allowance",
//         args: [
//             `0x${String(account.address)?.substring(2)}`,
//             `0x${String(address)?.substring(2)}`,
//         ],
//     });

//     useEffect(() => {
//         // if (pyusd_data != null) {
//         setPYUSDAllowance(pyusd_data);
//         // }
//     }, [pyusd_data]);

//     const SCALE_FACTOR = 1000000n;

//     const fetchCampaignDetails = async () => {
//         if (campaignData) {
//             const projectAmountRaised = parseUnits(
//                 campaignData.initiativeAmountRaised.toString(),
//                 "wei",
//             );
//             const projectGoal = parseUnits(
//                 campaignData.initiativeGoal.toString(),
//                 "wei",
//             );

//             const percentageRaised =
//                 (projectAmountRaised * SCALE_FACTOR) / projectGoal;
//             console.log(Number(percentageRaised) / Number(SCALE_FACTOR));

//             try {
//                 const response = await axios.get(
//                     `${process.env.NEXT_PUBLIC_DB_URL as string}/store`,
//                     {
//                         params: {
//                             id: campaignData.initiativeMetadata.substring(2),
//                         },
//                         headers: {
//                             "Content-Type": "application/json",
//                             CrawdifyServer: process.env
//                                 .NEXT_PUBLIC_HEADER_VALUE as string,
//                         },
//                     },
//                 );
//                 const { title, description } = response.data.campaigns[0];
//                 console.log({ title, description });
//                 setCampaignMetadata([{ title, description }]);
//             } catch (error) {
//                 setMessage(`ERROR: ${parseContractError(error)}`);
//                 setIcon("no");
//                 setIsShown(true);
//             }
//         }
//     };

//     useEffect(() => {
//         if (campaignData) {
//             console.log(campaignData);

//             fetchCampaignDetails();
//         } else {
//             console.log("Nothing to show here");
//         }
//     }, [campaignData]);

//     const claimFundsFromCampaign = async () => {
//         setIsLoading(true);

//         try {
//             const result = await writeContractAsync({
//                 abi: crawdifyStorageABI,
//                 address: `0x${String(campaignData?.initiativeAddress).substring(2)}`,

//                 account: account.address,
//                 functionName: "withdraw",
//                 args: [parseUnits(claimAmount, 6)],
//             });

//             if (result) {
//                 setMessage(`Campaign funds successfully claimed to wallet.`);
//                 setIcon("yes");
//                 setIsShown(true);
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             console.log(error);
//             setMessage(`ERROR: ${parseContractError(error)}`);
//             setIcon("no");
//             setIsShown(true);
//             setIsLoading(false);
//         }
//     };

//     return (
//         // <></>
//         <section className="w-full flex flex-col space-y-3 justify-start items-start px-6 glass-background py-4 rounded-lg">
//             {isValid ? (
//                 campaignData ? (
//                     Number(campaignData?.initiativeGoal) > 0 &&
//                     campaignMetadata.length > 0 ? (
//                         <>
//                             <section className="flex w-full space-x-4">
//                                 <div
//                                     className="w-1/2 max-h-[30rem] h-[30rem] bg-cover bg-center rounded-md"
//                                     style={{
//                                         backgroundImage: `url('../static/${imageUrl}.jpeg')`,
//                                     }}
//                                 ></div>
//                                 <section className="flex flex-col space-y-3 w-1/2">
//                                     <p className="text-3xl font-extrabold">
//                                         {campaignMetadata[0].title}
//                                     </p>
//                                     <section className="p-5 glass-background rounded-md w-full">
//                                         <p className="w-full break-words">
//                                             {campaignMetadata[0].description}
//                                         </p>
//                                     </section>
//                                     <div className="w-full bg-[#023430] rounded-full h-[0.35rem]">
//                                         <div
//                                             className="bg-[#bce26b] h-full rounded-full"
//                                             style={{
//                                                 width: `${(Number(formatUnits(campaignData.initiativeAmountRaised, 6)) / Number(formatUnits(campaignData.initiativeGoal, 6))) * 100}%`,
//                                             }}
//                                         ></div>
//                                     </div>
//                                     <p className="font-bold text-left">
//                                         {formatUnits(
//                                             String(
//                                                 campaignData.initiativeAmountRaised,
//                                             ),
//                                             6,
//                                         )}{" "}
//                                         PYUSD
//                                         <span className="font-normal">
//                                             {" "}
//                                             raised of{" "}
//                                         </span>
//                                         <span className="font-bold">
//                                             {formatUnits(
//                                                 String(
//                                                     campaignData.initiativeGoal,
//                                                 ),
//                                                 6,
//                                             )}{" "}
//                                             PYUSD
//                                         </span>
//                                     </p>
//                                     <p className="font-bold">
//                                         Found by{" "}
//                                         {campaignData.initiativeFounder ==
//                                         account.address ? (
//                                             <span>ME</span>
//                                         ) : (
//                                             <span>
//                                                 <Link
//                                                     href={`https://sepolia.etherscan.io/address/${campaignData.initiativeFounder}`}
//                                                     className="transition-all duration-500 hover:underline"
//                                                 >
//                                                     {`${String(campaignData.initiativeFounder).slice(0, 5)}...${String(campaignData.initiativeFounder).slice(-5)}`}
//                                                 </Link>
//                                             </span>
//                                         )}
//                                     </p>
//                                     {campaignData.initiativeFounder ==
//                                     account.address ? (
//                                         <>
//                                             <section className="flex flex-col space-y-2 justify-center items-center py-3">
//                                                 <input
//                                                     type="number"
//                                                     className="rounded-lg px-3 py-2 w-full appearance-none outline-none border-none glass-background"
//                                                     placeholder="0.1"
//                                                     min={0}
//                                                     value={claimAmount}
//                                                     onChange={
//                                                         handleClaimInputChange
//                                                     }
//                                                 />
//                                                 <button
//                                                     onClick={() =>
//                                                         claimFundsFromCampaign()
//                                                     }
//                                                     className="rounded-lg w-full flex justify-center items-center px-5 py-2 font-bold custom-gradient"
//                                                 >
//                                                     Claim funds from campaign
//                                                 </button>
//                                             </section>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <input
//                                                 type="number"
//                                                 className="rounded-lg px-3 py-2 w-full appearance-none outline-none border-none glass-background"
//                                                 placeholder="0.1"
//                                                 min={0}
//                                                 value={donationAmount}
//                                                 onChange={handleInputChange}
//                                             />
//                                             <button
//                                                 onClick={() => handleDonation()}
//                                                 className="rounded-lg w-full flex justify-center items-center px-5 py-2 font-bold custom-gradient"
//                                             >
//                                                 Donate
//                                             </button>{" "}
//                                         </>
//                                     )}
//                                 </section>
//                             </section>
//                         </>
//                     ) : (
//                         <div className="w-full">
//                             <p className="font-bold text-lg text-center">
//                                 This page doesn't exist yet.
//                             </p>
//                         </div>
//                     )
//                 ) : (
//                     <div className="w-full">
//                         <p className="font-bold text-lg text-center">
//                             We can't find what you're looking for.
//                         </p>
//                     </div>
//                 )
//             ) : (
//                 <div className="w-full">
//                     <p className="font-bold text-lg text-center">
//                         There's nothing here
//                     </p>
//                 </div>
//             )}
//         </section>
//     );
// };

// export default ExploreCampaign;
