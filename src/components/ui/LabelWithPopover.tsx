import React, { useState } from "react";
import circleInfo from "../../assets/circle-info.svg";

interface LabelWithPopoverProps {
  htmlFor: string;
  label: string;
  description: React.ReactNode;
}

const LabelWithPopover: React.FC<LabelWithPopoverProps> = ({ htmlFor, label, description }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <div className="relative inline-block">
      <label htmlFor={htmlFor} className="mb-2 flex items-center text-white">
        {label}
        <button type="button" onClick={togglePopover} className="ml-2 text-gray-500 focus:outline-none">
          <img src={circleInfo} alt="Info Icon" />
        </button>
      </label>
      {isPopoverOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-lg bg-gray-700 p-2 text-white shadow-lg">
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-full rotate-45 transform bg-gray-700"></div>
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelWithPopover;
