import { copyText } from "@/utils";
import React, { useState } from "react";

interface Option {
  label: string;
  [key: string]: any;
}

interface DropdownProps {
  label: string;
  options: Option[];
  selected: number;
  setSelected: (index: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selected, setSelected }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative flex flex-col items-start">
      <div className="flex cursor-pointer items-center" onClick={toggleDropdown}>
        <span className="cursor-pointer font-space text-primary-40">{label}</span>
        <span className="ml-2 text-primary-40">▼</span>
      </div>
      {options[selected] && (
        <span className="text-grey-400 mt-1 cursor-pointer" onClick={() => copyText(options[selected].value)}>
          {options[selected].label}
        </span>
      )}
      {isDropdownOpen && (
        <div className="absolute mt-2 rounded border border-gray-300 bg-white shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              className="block cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => {
                setSelected(index);
                toggleDropdown();
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
