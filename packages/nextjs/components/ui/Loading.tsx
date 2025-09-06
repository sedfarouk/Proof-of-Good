"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  color = "text-blue-600",
  text
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <motion.div
        className={`${sizeClasses[size]} ${color}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <svg className="animate-spin h-full w-full" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </motion.div>
      {text && (
        <motion.p 
          className="text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export const LoadingOverlay = ({ isLoading, text, children }: LoadingOverlayProps) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <LoadingSpinner size="lg" text={text} />
        </motion.div>
      )}
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export const LoadingButton = ({ 
  isLoading, 
  onClick, 
  children, 
  disabled, 
  className = "",
  loadingText = "Loading..."
}: LoadingButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center space-x-2 transition-all duration-200 ${
        isLoading || disabled 
          ? "opacity-75 cursor-not-allowed" 
          : "hover:opacity-90"
      } ${className}`}
    >
      {isLoading && (
        <LoadingSpinner size="sm" color="text-current" />
      )}
      <span className={isLoading ? "ml-2" : ""}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

interface PageLoadingProps {
  text?: string;
}

export const PageLoading = ({ text = "Loading..." }: PageLoadingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <motion.h2 
          className="mt-4 text-xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.h2>
        <motion.div 
          className="mt-2 flex justify-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className = "h-4 bg-gray-200 rounded", count = 1 }: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse ${className} ${i > 0 ? "mt-2" : ""}`}
        />
      ))}
    </>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <Skeleton className="h-6 bg-gray-200 rounded w-3/4" />
      <Skeleton className="h-4 bg-gray-200 rounded w-full" />
      <Skeleton className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="flex space-x-4 mt-4">
        <Skeleton className="h-8 bg-gray-200 rounded w-20" />
        <Skeleton className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
};
