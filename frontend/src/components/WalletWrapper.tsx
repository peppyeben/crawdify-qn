"use client";
import {
    Address,
    Avatar,
    EthBalance,
    Identity,
    Name,
} from "@coinbase/onchainkit/identity";
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownBasename,
    WalletDropdownDisconnect,
    WalletDropdownFundLink,
    WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import Link from "next/link";

type WalletWrapperParams = {
    text?: string;
    className?: string;
    withWalletAggregator?: boolean;
};
export default function WalletWrapper({
    className,
    text,
    withWalletAggregator = false,
}: WalletWrapperParams) {
    return (
        <>
            <Wallet>
                <ConnectWallet
                    withWalletAggregator={withWalletAggregator}
                    text={text}
                    className={className}
                >
                    <Avatar className="h-6 w-6 bg-white" />
                    <Name className="text-white" />
                </ConnectWallet>
                <WalletDropdown>
                    {/* <Link
                        href={"/profile"}
                        className="text-[#181818] font-bold px-4 p-3"
                    >
                        Crawdify Profile
                    </Link> */}

                    <Identity
                        className="px-4 pt-3 pb-2"
                        hasCopyAddressOnClick={true}
                    >
                        <Avatar />
                        <Name />
                        <Address />
                        <EthBalance />
                    </Identity>
                    {/* <WalletDropdownBasename /> */}
                    <WalletDropdownDisconnect />
                </WalletDropdown>
            </Wallet>
        </>
    );
}
