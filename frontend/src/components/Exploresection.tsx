"use client";

import Link from "next/link";
import Campaigncard from "./Campaigncard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoader } from "./Loadercontext";
import { useAccount, useReadContracts } from "wagmi";
import { crawdifyStorageABI, crawdifyFactoryABI } from "../app/utils/abi";

interface Campaign {
    id: string;
    title: string;
    description?: string;
    goal: string;
    end_date?: number;
    user_address?: string;
}

interface ContractResult {
    result: any[]; // or whatever type you expect for result
    // Add other properties if there are any
    error: any;
    status: any;
}

interface CombinedResult {
    goal: bigint; // Assuming projectGoal is of type bigint
    title: string;
    description?: string;
    id: string; // The ID is a string after substring conversion
    initiativeAmountRaised: string;
    initiativeFounder: string;
    initiativeAddress: string;
}

const Exploresection = () => {
    const [campaigns, setExploreCampaigns] = useState<Campaign[]>([]);
    const { setIsLoading } = useLoader();
    const [contractAddresses, setContractAddresses] = useState<string[]>([]);
    const [exploreResults, setCombinedResults] = useState<CombinedResult[]>([]);
    const account = useAccount();
    const [storageAddresses, setstorageAddresses] = useState<string[]>([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_DB_URL as string}/store`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            CrawdifyServer: process.env
                                .NEXT_PUBLIC_HEADER_VALUE as string,
                        },
                    },
                );

                const mappedCampaigns =
                    response.data.campaigns.length > 0
                        ? response.data.campaigns.map((campaign: any) => ({
                              ...campaign,
                              id: campaign._id,
                              _id: undefined,
                          }))
                        : [];
                setExploreCampaigns(mappedCampaigns);
            } catch (error) {
                console.log(error);
                setExploreCampaigns([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    useEffect(() => {
        if (campaigns.length > 0) {
            const addresses = [
                ...new Set(
                    campaigns
                        .map((campaign) => campaign.user_address)
                        .filter((address) => address !== undefined),
                ),
            ];
            setContractAddresses(addresses);
        }
    }, [campaigns]);
    const getCampaignContractsFromFactory = contractAddresses.map(
        (address) =>
            ({
                address: `0x${process.env.NEXT_PUBLIC_CRAWDIFY_ETH_SEPOLIA as string}`,
                args: [address],
                abi: crawdifyFactoryABI,
            }) as const,
    );

    const { data: contractResults } = useReadContracts<ContractResult[]>({
        contracts: getCampaignContractsFromFactory.map((contract) => ({
            ...contract,
            functionName: "getFounderInitiatives",
        })),
    });

    useEffect(() => {
        if (contractResults) {
            const combinedResults: any = [];

            const filteredContractResults = contractResults.filter(
                (i) => i.status == "success",
            );

            filteredContractResults.flatMap((contract: any) => {
                contract.result.map((result: any) => {
                    combinedResults.push(result);
                });
            });

            setstorageAddresses(combinedResults);
        }
    }, [contractResults]);

    const getStorageContracts = storageAddresses.map(
        (address) =>
            ({
                address: `0x${address.substring(2)}`,
                abi: crawdifyStorageABI,
            }) as const,
    );

    const { data: storageContractResults } = useReadContracts({
        contracts: getStorageContracts.map((contract) => ({
            ...contract,
            functionName: "getInitiative",
        })),
    });

    useEffect(() => {
        if (storageContractResults) {
            const combinedResults: any = [];
            const seenIds = new Set();

            const filteredContractResults = storageContractResults.filter(
                (i) => i.status == "success",
            );

            filteredContractResults.flatMap((result: any) => {
                const campaignId = result.result.initiativeMetadata.toString();

                const campaign: any = campaigns.find(
                    (c: any) => c.id === String(campaignId).substring(2),
                );

                if (campaign) {
                    const id = String(campaignId).substring(2);

                    if (!seenIds.has(id)) {
                        seenIds.add(id);

                        combinedResults.push({
                            goal: result.result.initiativeGoal,
                            initiativeAmountRaised:
                                result.result.initiativeAmountRaised,
                            title: campaign.title,
                            description: campaign.description,
                            id: id,
                            initiativeFounder: result.result.initiativeFounder,
                            initiativeAddress: result.result.initiativeAddress,
                            // image: images[
                            //     Math.floor(Math.random() * images.length)
                            // ],
                        });
                    }
                }
            });

            console.log(combinedResults);

            setCombinedResults(combinedResults);
        }
    }, [storageContractResults]);

    return (
        // <></>
        <section className="flex flex-col justify-start items-start pt-4 space-y-2 w-full">
            {exploreResults.length > 0 ? (
                <section className="grid grid-cols-3 gap-4 pt-4 xl:grid-cols-4">
                    {exploreResults.map((res) => (
                        <Campaigncard
                            title={res.title}
                            goal={String(res.goal)}
                            initiativeAmountRaised={String(
                                res.initiativeAmountRaised,
                            )}
                            description={String(res.description)}
                            initiativeFounder={res.initiativeFounder}
                            initiativeAddress={res.initiativeAddress}
                            id={res.id}
                            imageUrl={Math.floor(Math.random() * 6) + 1}
                            key={res.id}
                        />
                    ))}
                </section>
            ) : (
                <section className="flex flex-col py-16 justify-center items-center w-full">
                    <p className="text-center font-bold text-xl">
                        Can't get campaigns at this time, connect wallet or
                        reload page.
                    </p>
                </section>
            )}{" "}
        </section>
    );
};

export default Exploresection;
