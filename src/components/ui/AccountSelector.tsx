import { copyText } from "@/utils";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheck, MdKeyboardArrowDown, MdContentCopy } from "react-icons/md";

interface Option {
  label: string;
  value: string;
  [key: string]: any;
}

interface AccountSelectorProps {
  label: string;
  options: Option[];
  selected: number;
  setSelected: (index: number) => void;
  isLoading?: boolean;
  error?: string;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  label,
  options,
  selected,
  setSelected,
  isLoading = false,
  error,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (value: string) => {
    copyText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsDropdownOpen(!isDropdownOpen);
    }
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <label className="mb-2 block">{label}</label>
      <div
        className={`relative rounded-lg border bg-card ${error ? "border-error-40" : "border-card-border"} transition-all duration-200`}
      >
        <button
          className="w-full bg-card p-4 text-left focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          disabled={isLoading}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-50">{options[selected]?.label || "Select an option"}</span>
            <MdKeyboardArrowDown
              className={`h-5 w-5 text-gray-50 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 transform" : ""}`}
            />
          </div>
          {options[selected] && options[selected].value && (
            <div className="mt-2 flex items-center">
              <span className="break-all">{options[selected].value}</span>
              <div
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(options[selected].value);
                }}
                className="ml-2 cursor-pointer rounded bg-card p-1 transition-colors hover:bg-card-border"
              >
                {isCopied ? (
                  <MdCheck className="h-4 w-4 text-success-40" />
                ) : (
                  <MdContentCopy className="h-4 w-4 text-gray-50" />
                )}
              </div>
            </div>
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full rounded-lg border border-card-border bg-card"
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full bg-card p-4 text-left transition-colors duration-150`}
                  onClick={() => {
                    setSelected(index);
                    setIsDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={selected === index}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-right text-error-40">{error}</p>}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-40 border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
