"use client";

import Link from "next/link";
import Campaigncard from "./Campaigncard";
import Exploresection from "./Exploresection";

const Heroexplore = () => {
    return (
        <section className="flex flex-col justify-between items-center w-full space-y-6 mx-auto pt-8 px-6">
            <section className="flex flex-row justify-between items-center w-full">
                <p className="flex flex-col space-y-2">
                    <span className="text-2xl font-extrabold">
                        Make a Difference: Contribute or Launch a Campaign
                    </span>
                    <span>
                        Join a community of changemakers and fund projects that
                        matter.
                    </span>
                </p>
                <Link
                    href={"/explore"}
                    className="rounded-lg flex justify-center items-center px-5 py-2 font-bold custom-gradient"
                >
                    <span>See More</span>
                    <img
                        src="./img/right-arrow-icon.png"
                        alt=""
                        className="w-5"
                    />
                </Link>
            </section>
            {/* <section className="grid grid-cols-3 gap-4 xl:grid-cols-4">
                
            </section> */}
            <Exploresection></Exploresection>
        </section>
    );
};

export default Heroexplore;
