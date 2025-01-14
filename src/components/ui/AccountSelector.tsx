import { copyText } from '@/utils';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheck, MdKeyboardArrowDown, MdContentCopy } from 'react-icons/md';

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

const AccountSelector: React.FC<AccountSelectorProps> = ({ label, options, selected, setSelected, isLoading = false, error }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (value: string) => {
    copyText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsDropdownOpen(!isDropdownOpen);
    }
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <label className="mb-2 block">{label}</label>
      <div
        className={`
          relative bg-gray-80 rounded-lg border
          ${error ? 'border-error-40' : 'border-gray-70'}
          transition-all duration-200
        `}
      >
        <button
          className="w-full p-4 text-left focus:outline-none bg-gray-80"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          disabled={isLoading}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-50">{options[selected]?.label || 'Select an option'}</span>
            <MdKeyboardArrowDown
              className={`w-5 h-5 text-gray-50 transition-transform duration-200 
                ${isDropdownOpen ? 'transform rotate-180' : ''}`}
            />
          </div>
          {options[selected] && (
            <div className="flex items-center mt-2">
              <span className="text-gray-50 break-all">{options[selected].value}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(options[selected].value);
                }}
                className="ml-2 p-1 bg-gray-80 hover:bg-gray-70 rounded transition-colors"
              >
                {isCopied ? <MdCheck className="w-4 h-4 text-success-40" /> : <MdContentCopy className="w-4 h-4 text-gray-50" />}
              </button>
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
              className="absolute z-10 w-full mt-1 bg-gray-80 border border-gray-70 rounded-lg"
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`
                    w-full p-4 text-left bg-gray-80 hover:bg-gray-70
                    ${selected === index ? 'bg-primary-90 text-primary-40' : 'text-white'}
                    transition-colors duration-150
                  `}
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
      {error && <p className="text-error-40 text-right">{error}</p>}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary-40 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
