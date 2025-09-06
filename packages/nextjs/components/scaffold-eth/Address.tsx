import React from "react";

interface AddressProps {
  address: string;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}

export const Address: React.FC<AddressProps> = ({ 
  address, 
  disableAddressLink = false, 
  format = "short",
  size = "base" 
}) => {
  const formatAddress = (addr: string) => {
    if (format === "short") {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    return addr;
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  if (disableAddressLink) {
    return (
      <span className={`font-mono ${sizeClasses[size]}`}>
        {formatAddress(address)}
      </span>
    );
  }

  return (
    <a
      href={`/blockexplorer/address/${address}`}
      className={`font-mono text-blue-600 hover:text-blue-800 underline ${sizeClasses[size]}`}
    >
      {formatAddress(address)}
    </a>
  );
};
