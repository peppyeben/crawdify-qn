// src/components/RouteTransition.tsx
"use client"; // This is a client component

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Use this to get the current path

const RouteTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname(); // Get the current pathname
    const [fade, setFade] = useState(false); // State to control fading

    useEffect(() => {
        // Start fade out when the pathname changes
        setFade(true);

        // Wait for the transition to complete before fading back in
        const timer = setTimeout(() => {
            setFade(false);
        }, 500); // Adjust this time to match your CSS transition duration

        // Clean up the timer
        return () => clearTimeout(timer);
    }, [pathname]); // Run this effect when the pathname changes

    return (
        <div className={fade ? "fade-exit" : ""}>
            {children} {/* Render the children here */}
        </div>
    );
};

export default RouteTransition;
