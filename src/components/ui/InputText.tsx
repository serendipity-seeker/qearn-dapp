import React, { useState, forwardRef, useImperativeHandle, ChangeEvent } from "react";
import LabelWithPopover from "./LabelWithPopover";
import { formatQubicAmount } from "@/utils";

interface InputNumbersProps {
  id: string;
  label: string;
  placeholder?: string;
  description?: React.ReactNode;
  onChange: (value: string) => void;
}

interface InputNumbersRef {
  validate: () => boolean;
}

const InputNumbers = forwardRef<InputNumbersRef, InputNumbersProps>(
  ({ id, label, placeholder, description, onChange }, ref) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setError("");
      onChange(e.target.value);
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
        <div className="mb-2 flex items-center justify-between">
          {description ? (
            <LabelWithPopover htmlFor={id} label={label} description={description} />
          ) : (
            <label htmlFor={id}>{label}</label>
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
