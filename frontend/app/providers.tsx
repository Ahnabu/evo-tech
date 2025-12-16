"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider, HeroUIProviderProps } from "@heroui/react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "@/components/error/errboundaryfallback";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

const Providers = ({ children }: HeroUIProviderProps) => {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <SessionProvider>{children}</SessionProvider>
          </ReactErrorBoundary>
        </PersistGate>
      </ReduxProvider>
    </HeroUIProvider>
  );
};

export { Providers };
