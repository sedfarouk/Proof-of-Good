"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { NotificationProvider } from "~~/providers/NotificationProvider";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import Header from "./Header";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

// Create a client
const queryClient = new QueryClient();

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider>
            <NotificationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{mounted && children}</main>
                <div className="fixed bottom-4 right-4 z-50">
                  <ThemeToggle />
                </div>
              </div>
            </NotificationProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
