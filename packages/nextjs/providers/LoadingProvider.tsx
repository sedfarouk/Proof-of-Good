"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoadingOverlay } from "../components/ui/Loading";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, text?: string) => void;
  loadingText: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const setLoading = (loading: boolean, text: string = "Loading...") => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingText }}>
      <LoadingOverlay isLoading={isLoading} text={loadingText}>
        {children}
      </LoadingOverlay>
    </LoadingContext.Provider>
  );
};
