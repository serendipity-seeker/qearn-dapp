import React, { useState, forwardRef, useImperativeHandle, ChangeEvent } from 'react';
import LabelWithPopover from './LabelWithPopover';
import { formatQubicAmount } from '@/utils';

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

const InputNumbers = forwardRef<InputNumbersRef, InputNumbersProps>(({ id, label, placeholder, description, onChange }, ref) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/,/g, '');
    setValue(formatQubicAmount(Number(newValue)));
    if (newValue === '') {
      setError('This field is required');
    } else {
      setError('');
    }
    onChange(newValue);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (value === '') {
        setError('This field is required');
        return false;
      }
      setError('');
      return true;
    },
  }));

  return (
    <div>
      {description && <LabelWithPopover htmlFor={id} label={label} description={description} />}
      {!description && (
        <label htmlFor={id} className="block text-white mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        className={`w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500 ${error && 'border-red-500'}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-right">{error}</p>}
    </div>
  );
});

export default InputNumbers;
