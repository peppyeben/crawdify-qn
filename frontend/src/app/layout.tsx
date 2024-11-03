import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../config";

import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { LoaderProvider } from "src/components/Loadercontext";
import LoaderWrapper from "src/components/Loaderwrapper";
import { ModalProvider } from "src/components/Modalcontext";
import ModalWrapper from "src/components/Modalwrapper";

const OnchainProviders = dynamic(
    () => import("src/components/OnchainProviders"),
    {
        ssr: false,
    },
);

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

export const metadata: Metadata = {
    title: "Crawdify",
    description: "Your dreams, funded by community",
    openGraph: {
        title: "Crawdify",
        description: "Your dreams, funded by community",
        images: [
            `https://crawdify.vercel.app/crawdify.png`,
            `${NEXT_PUBLIC_URL}/crawdify.png`,
        ],
    },
    icons: "https://crawdify.vercel.app/crawdify.png",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ModalProvider>
                    <ModalWrapper>
                        <LoaderProvider>
                            <LoaderWrapper>
                                <div className="top-left-vector-gradient hidden lg:block"></div>
                                <div className="middle-home-vector-gradient hidden lg:block"></div>
                                <div className="middle-home-mobile-vector-gradient lg:hidden"></div>
                                <OnchainProviders>
                                    <div className="relative hidden overflow-hidden lg:flex flex-col space-y-6 bg-transparent">
                                        <Navbar></Navbar>
                                        {children}
                                        <Footer></Footer>
                                    </div>

                                    <div className="lg:hidden h-screen flex justify-center items-center mx-auto px-14">
                                        <p className="text-lg text-left">
                                            CRAWDIFY is available on just bigger
                                            screens for now.
                                        </p>
                                    </div>
                                </OnchainProviders>
                            </LoaderWrapper>
                        </LoaderProvider>
                    </ModalWrapper>
                </ModalProvider>
            </body>
        </html>
    );
}
