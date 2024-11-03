"use client";

import React from "react";
import Loader from "./Loader"; // Import the Loader component
import { useLoader } from "./Loadercontext";

const LoaderWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isLoading } = useLoader(); // Get the loading state from context

    return (
        <>
            {isLoading && <Loader />}{" "}
            {/* Show loader only when isLoading is true */}
            {children} {/* Render the rest of the application */}
        </>
    );
};

export default LoaderWrapper;
