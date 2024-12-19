import React, { useState } from 'react';

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
      <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
        <span className="text-primary-40 font-space cursor-pointer">{label}</span>
        <span className="ml-2 text-primary-40">▼</span>
      </div>
      {options[selected] && <span className="mt-1 text-grey-400">{options[selected].label}</span>}
      {isDropdownOpen && (
        <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
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
