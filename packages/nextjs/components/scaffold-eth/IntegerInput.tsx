import React from "react";

interface IntegerInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "ghost";
}

export const IntegerInput: React.FC<IntegerInputProps> = ({
  value,
  onChange,
  placeholder = "Enter a number",
  disabled = false,
  variant = "default",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow integers
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variantClasses = variant === "ghost" ? "border-gray-300" : "border-gray-400";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white";

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
    />
  );
};
