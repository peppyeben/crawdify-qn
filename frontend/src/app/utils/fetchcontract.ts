import { abi } from "./abi";
import { useWriteContract, useReadContract, useReadContracts } from "wagmi";

interface Campaign {
    id: string;
    data: {
        name: string;
        description?: string;
        goal: string;
        endDate?: number;
        userAddress?: string;
    };
}

export const fetchFromContract = async (campaigns: Campaign[]) => {
    if (campaigns.length > 0) {
        const addresses = [
            ...new Set(
                campaigns.map((campaign) => campaign.data.userAddress),
            ),
        ];

        const getCampaignContracts = addresses.map(
            (address) =>
                ({
                    address: `0x${process.env.NEXT_PUBLIC_CRAWDIFY_ETH_SEPOLIA as string}`,
                    args: [address],
                    abi,
                }) as const,
        );

        console.log(getCampaignContracts);

        const res = useReadContracts({
            contracts: [
                { ...getCampaignContracts, functionName: "getCampaigns" },
            ],
        });

        console.log(res)

    } else {
        console.log("nonee");
    }
};