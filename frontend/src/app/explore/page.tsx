"use client";

import Link from "next/link";
import Exploresection from "src/components/Exploresection";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Explore() {
    const account = useAccount();

    return (
        <>
            <section className="flex flex-col justify-start items-start w-full mx-auto px-6 pt-8 space-y-4">
                <section className="flex flex-col justify-start items-start space-y-5 pb-6 w-2/3">
                    <h4 className="uppercase font-extrabold text-5xl">
                        Your dreams funded by the community.
                    </h4>
                    <p className="">
                        Join forces to bring your dreams to life. Discover
                        inspiring projects, connect with like-minded
                        individuals, and make a tangible difference in the
                        world.
                    </p>
                    <Link href={"/create"}>
                        <button
                            type="button"
                            className="rounded-lg flex space-x-2 px-5 justify-center items-center py-3 font-bold custom-gradient"
                        >
                            <span>Create a Campaign</span>
                            <img
                                src="./img/right-arrow-icon.png"
                                alt=""
                                className="w-5"
                            />
                        </button>
                    </Link>
                </section>
                <div className="w-full bg-white p-[0.01rem]"></div>
                <p className="text-xl font-bold">
                    Make a Difference: Contribute to or Launch a Campaign
                </p>
                <p className="text-sm">
                    Join a community of changemakers and fund projects that
                    matter.
                </p>
                <section className="flex justify-between items-center w-full pt-6">
                    <p className="rounded-3xl bg-white px-4 py-2 text-gray-900">
                        All
                    </p>
                    <p className="relative">
                        <input
                            type="text"
                            className="pl-9 pr-4 py-2 pb-3 outline-none border-none rounded-3xl glass-background"
                            placeholder="Search campaigns..."
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute top-[0.75rem] left-2 w-5 h-5"
                        >
                            <circle cx="10.5" cy="10.5" r="7" />
                            <line x1="21" y1="21" x2="15.8" y2="15.8" />
                        </svg>
                    </p>
                </section>
                <Exploresection></Exploresection>
            </section>
        </>
    );
}

export default Explore;
