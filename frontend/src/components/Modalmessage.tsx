"use client";
import "../app/custom.css";

import React, { useEffect, useMemo } from "react";
import { useModal } from "./Modalcontext";

const Modalmessage = () => {
    const { isShown, setIsShown, message, icon } = useModal();
    const iconSrc = icon === "yes" ? "./svgs/yes-svg.svg" : "./svgs/no-svg.svg";

    if (!isShown) return null;
    return (
        <div
            onClick={() => setIsShown(false)}
            className="h-full fixed flex justify-center items-center w-full z-50 loader-glass-background bg-opacity-10 transition-all duration-500"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex flex-col text-[#060606] justify-center items-center p-10 rounded-2xl glass-background-loader z-30 max-w-[35rem] w-full transition-all duration-500"
            >
                <button
                    onClick={() => setIsShown(false)}
                    className="absolute rounded-full right-2 top-2 shadow-lg text-red-500 font-sm font-bold py-2 px-4 uppercase glass-background transition-all duration-200 hover:bg-gray-50 hover:bg-opacity-30"
                >
                    x
                </button>
                <img src={iconSrc} alt="" className="w-24" />

                <p className="text-lg text-white font-bold pt-6 w-full text-wrap text-center">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Modalmessage;
