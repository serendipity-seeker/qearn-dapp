import React, { useState, ChangeEvent } from "react";

interface ConfirmSliderProps {
  onConfirm: (confirmed: boolean) => void;
}

const ConfirmSlider: React.FC<ConfirmSliderProps> = ({ onConfirm }) => {
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSliderValue(Number(value));

    if (value === "100") {
      onConfirm(true);
    } else {
      onConfirm(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-gray-700">Slide to confirm</span>
        <span className="text-gray-700">{sliderValue}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
};

export default ConfirmSlider;
