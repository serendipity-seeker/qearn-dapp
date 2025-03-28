import React, { ChangeEvent } from "react";

interface InputRegExProps {
  id: string;
  label: string;
  initialValue: string;
  regEx?: RegExp;
  placeholder?: string;
  onChange: (value: string) => void;
}

const InputRegEx: React.FC<InputRegExProps> = ({
  id,
  label,
  initialValue,
  regEx = /^\d{0,2}(\.\d{0,2})?$/,
  placeholder = "00.00",
  onChange,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers and dot, and ensure format like 00.00
    if (regEx.test(value)) {
      onChange(value);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-white">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={`w-full rounded-lg border border-gray-70 bg-gray-80 p-4 text-white placeholder-gray-500`}
        value={initialValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputRegEx;
