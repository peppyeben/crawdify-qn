"use client";

import React from "react";
import Modalmessage from "./Modalmessage";
import { useModal } from "./Modalcontext";

const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isShown } = useModal(); // Get the loading state from context

    return (
        <>
            {isShown && <Modalmessage />}{" "}
            {/* Show modal only when isShown is true */}
            {children} {/* Render the rest of the application */}
        </>
    );
};

export default ModalWrapper;
