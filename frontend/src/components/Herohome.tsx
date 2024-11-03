"use client"

import Link from "next/link";

const Herohome = () => {
    return (
        <section className="flex justify-between items-center w-full mx-auto px-6">
            <section className="flex flex-col justify-start items-center space-y-5">
                <h4 className="uppercase font-extrabold text-5xl">
                    Your dreams funded by community.
                </h4>
                <p>
                    Join forces to bring your dreams to life. Discover inspiring projects,
                    connect with like-minded individuals, and make a tangible difference
                    in the world.
                </p>
                <section className="flex space-x-4 mr-auto">
                    <Link href={'/explore'} className="rounded-lg flex px-5 py-2 font-bold custom-gradient">
                        <span>Explore</span>
                        <img src="./img/right-arrow-icon.png" alt="" className="w-5" />
                    </Link>
                    <button className="rounded-lg flex px-5 py-2 font-bold hover:bg-[#4f5f2f] hover:bg-opacity-20 transition-all duration-300">
                        <span>How it works</span>
                        <img src="./img/right-arrow-icon.png" alt="" className="w-5" />
                    </button>
                </section>
            </section>
            <img src="./img/herohome.png" alt="" className="w-[30rem]" />
        </section>
    );
};

export default Herohome;
