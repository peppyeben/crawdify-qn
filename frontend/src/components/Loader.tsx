"use client";
import "../app/custom.css";

import React, { useEffect, useMemo } from "react";

const Loader = () => {
    return (
        <div className="h-full fixed flex justify-center items-center w-full z-50 loader-glass-background bg-opacity-10">
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
