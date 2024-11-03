"use client";
import { useAccount } from "wagmi";
import Herohome from "src/components/Herohome";
import Heroexplore from "src/components/Heroexplore";

export default function Page() {
    const { address } = useAccount();

    return (
        <>
            <Herohome></Herohome>
            <Heroexplore></Heroexplore>
        </>
    );
}
