import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  return (
    <span 
      className={`loading loading-spinner loading-${size} ${className}`}
      aria-label="Loading..."
    />
  );
};
