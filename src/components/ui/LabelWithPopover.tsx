import React, { useState } from 'react';
import circleInfo from '../../assets/circle-info.svg';

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
      <label htmlFor={htmlFor} className="text-white mb-2 flex items-center">
        {label}
        <button type="button" onClick={togglePopover} className="ml-2 text-gray-500 focus:outline-none">
          <img src={circleInfo} alt="Info Icon" />
        </button>
      </label>
      {isPopoverOpen && (
        <div className="absolute z-10 mt-2 p-2 w-56 bg-gray-700 text-white rounded-lg shadow-lg">
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-gray-700 rotate-45"></div>
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelWithPopover;
