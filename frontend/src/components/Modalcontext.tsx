"use client";

import React, { createContext, useContext, useState } from "react";

interface ModalcontextType {
    isShown: boolean;
    setIsShown: (loading: boolean) => void;
    message: string;
    setMessage: (message: string) => void;
    icon: string;
    setIcon: (message: string) => void;
}

const ModalContext = createContext<ModalcontextType>({
    isShown: false,
    setIsShown: () => {},
    message: "",
    setMessage: () => {},
    icon: "",
    setIcon: () => {},
});

export const useModal = () => {
    return useContext(ModalContext);
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isShown, setIsShown] = useState(false);
    const [message, setMessage] = useState("");
    const [icon, setIcon] = useState("");

    return (
        <ModalContext.Provider
            value={{ isShown, setIsShown, message, setMessage, icon, setIcon }}
        >
            {children}
        </ModalContext.Provider>
    );
};
