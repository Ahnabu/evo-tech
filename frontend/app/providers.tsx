"use client";

import { useRouter } from "next/navigation";
import { NextUIProvider, NextUIProviderProps } from "@nextui-org/react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "@/components/error/errboundaryfallback";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/store/store";

const Providers = ({ children }: NextUIProviderProps) => {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <ReduxProvider store={store}>
                <ReactErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                    <SessionProvider >
                        {children}
                    </SessionProvider>
                </ReactErrorBoundary>
            </ReduxProvider>
        </NextUIProvider>
    );
}

export { Providers };
