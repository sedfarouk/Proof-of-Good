import React from "react";

interface BalanceProps {
  address: string;
  className?: string;
  usdMode?: boolean;
}

export const Balance: React.FC<BalanceProps> = ({ className = "" }) => {
  // In a real implementation, you would fetch the balance from the blockchain
  // For now, return a placeholder
  const mockBalance = "0.0";

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="text-sm">
        {mockBalance} ETH
      </span>
    </div>
  );
};
