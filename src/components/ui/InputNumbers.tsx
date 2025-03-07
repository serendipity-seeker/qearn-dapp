import React, { useState, forwardRef, useImperativeHandle, ChangeEvent } from "react";
import LabelWithPopover from "./LabelWithPopover";
import { formatQubicAmount } from "@/utils";

interface InputNumbersProps {
  id: string;
  label: string;
  placeholder?: string;
  description?: React.ReactNode;
  maxAmount?: number;
  onChange: (value: string) => void;
}

interface InputNumbersRef {
  validate: () => boolean;
}

const InputNumbers = forwardRef<InputNumbersRef, InputNumbersProps>(
  ({ id, label, placeholder, description, maxAmount, onChange }, ref) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9,]/g, "").replace(/,/g, "");
      if (newValue === "") {
        setValue("");
        setError("This field is required");
        onChange("");
        return;
      }
      const formattedValue = formatQubicAmount(Number(newValue));
      setValue(formattedValue);
      setError("");
      onChange(newValue);
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        if (value === "") {
          setError("This field is required");
          return false;
        }
        setError("");
        return true;
      },
    }));

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          {description ? (
            <LabelWithPopover htmlFor={id} label={label} description={description} />
          ) : (
            <label htmlFor={id}>{label}</label>
          )}
          {maxAmount !== undefined && (
            <span className="text-sm text-gray-500">
              Max: {formatQubicAmount(maxAmount)}
            </span>
          )}
        </div>
        <input
          id={id}
          type="text"
          className={`w-full rounded-lg border border-card-border bg-card p-4 placeholder-gray-500 ${error && "border-red-500"}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        {error && <p className="text-right text-red-500">{error}</p>}
      </div>
    );
  },
);

export default InputNumbers;
