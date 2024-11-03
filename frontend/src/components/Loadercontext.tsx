"use client"; // Ensure this is client-side because it uses useState

import React, { createContext, useContext, useState } from "react";

// Define the type for the context
interface LoaderContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

// Create the context with default values
const LoaderContext = createContext<LoaderContextType>({
    isLoading: false, // Default state
    setIsLoading: () => {}, // Default function
});

// Hook to use the Loader context
export const useLoader = () => {
    return useContext(LoaderContext);
};

// LoaderProvider component to wrap your app
export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};
