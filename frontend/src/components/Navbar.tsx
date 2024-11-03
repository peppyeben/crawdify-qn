"use client";

import React, { useEffect, useMemo } from "react";

import Link from "next/link";
import WalletWrapper from "./WalletWrapper";

const Navbar = () => {
    return (
        <nav className="bg-transparent p-4 w-full flex flex-row justify-between items-center">
            <Link href={"/"} className="uppercase font-black text-lg">
                crawdify
            </Link>
            <section className="flex justify-center space-x-8 text-sm">
                <Link href={"/create"} className="font-medium hover:underline">
                    Create new campaign
                </Link>
                <Link href={"/explore"} className="font-medium hover:underline">
                    Explore campaigns
                </Link>
                <Link href={"/"} className="font-medium hover:underline">
                    How it works
                </Link>
            </section>
            <WalletWrapper
                withWalletAggregator={true}
                text="Connect Wallet"
                className="rounded-lg !text-white px-5 py-2 font-bold custom-gradient"
            ></WalletWrapper>
        </nav>
    );
};

export default Navbar;
