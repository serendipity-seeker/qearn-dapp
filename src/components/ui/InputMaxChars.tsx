import { useEffect, useState, forwardRef, useImperativeHandle, ChangeEvent } from 'react';
import clsx from 'clsx';

interface InputMaxCharsProps {
  id: string;
  label: string;
  max: number;
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => void;
  className?: string;
}

interface InputMaxCharsRef {
  validate: () => boolean;
}

const InputMaxChars = forwardRef<InputMaxCharsRef, InputMaxCharsProps>(({ id, label, max, placeholder, initialValue = '', onChange, className }, ref) => {
  const [value, setValue] = useState<string>(initialValue);
  const [numChars, setNumChars] = useState<number>(initialValue.length);
  const [error, setError] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length > max) {
      setError(`Maximum ${max} characters allowed`);
    } else {
      setError('');
      setNumChars(newValue.length);
      setValue(newValue);
      onChange(newValue);
    }
  };

  useEffect(() => {
    setValue(initialValue);
    setNumChars(initialValue.length);
  }, [initialValue]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (value.length === 0) {
        setError('This field is required');
        return false;
      } else if (value.length > max) {
        setError(`Maximum ${max} characters allowed`);
        return false;
      } else {
        setError('');
        return true;
      }
    },
  }));

  return (
    <div className={clsx('', className)}>
      <label htmlFor={id} className="block text-white mb-2">
        {label}
      </label>
      <input id={id} type="text" className="w-full p-4 bg-gray-80 text-white rounded-lg placeholder-gray-500 border-2 border-gray-70" placeholder={placeholder} value={value} onChange={handleChange} />
      <div className="text-right text-gray-500 text-sm mt-1">
        {error && <p className="text-red-500">{error}</p>} {numChars}/{max}
      </div>
    </div>
  );
});

export default InputMaxChars;
