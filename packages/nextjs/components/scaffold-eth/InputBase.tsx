import React from "react";

interface InputBaseProps {
  name?: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export const InputBase: React.FC<InputBaseProps> = ({
  name,
  value,
  onChange,
  placeholder = "",
  error = false,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const borderColor = error ? "border-red-500" : "border-gray-400";

  return (
    <input
      name={name}
      type="text"
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
    />
  );
};
