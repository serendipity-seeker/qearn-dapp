import { useState, forwardRef, useImperativeHandle, ChangeEvent } from 'react';

interface SelectDateTimeProps {
  label: string;
  fieldId: string;
  onChange: (value: { date: string; time: string }) => void;
}

const SelectDateTime = forwardRef<{ validate: () => boolean }, SelectDateTimeProps>(({ label, fieldId, onChange }, ref) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHours, setSelectedHours] = useState<string>('');
  const [selectedMinutes, setSelectedMinutes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    notifyChange(date, selectedHours, selectedMinutes);
  };

  const handleHoursChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const hours = event.target.value;
    setSelectedHours(hours);
    notifyChange(selectedDate, hours, selectedMinutes);
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const minutes = event.target.value;
    setSelectedMinutes(minutes);
    notifyChange(selectedDate, selectedHours, minutes);
  };

  const notifyChange = (date: string, hours: string, minutes: string) => {
    const time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    onChange({ date, time });
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!selectedDate) {
        setError('Date is required');
        return false;
      }
      if (!selectedHours) {
        setError('Hours are required');
        return false;
      }
      if (!selectedMinutes) {
        setError('Minutes are required');
        return false;
      }
      setError('');
      return true;
    },
  }));

  return (
    <div>
      <label className="block text-white mb-2">{label}</label>
      <div className="flex space-x-2">
        {/* Date Field */}
        <div className="flex-1 relative">
          <input
            id={`${fieldId}-date`}
            type="date"
            className="w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500"
            placeholder="Select date"
            onChange={handleDateChange}
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Hours Select Field */}
        <div className="flex-1">
          <select id={`${fieldId}-hours`} className="w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500" onChange={handleHoursChange} value={selectedHours}>
            <option value="" disabled>
              Hour
            </option>
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour.toString().padStart(2, '0')}>
                {hour.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Minutes Select Field */}
        <div className="flex-1">
          <select id={`${fieldId}-minutes`} className="w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500" onChange={handleMinutesChange} value={selectedMinutes}>
            <option value="" disabled>
              Minute
            </option>
            {[...Array(60).keys()].map((minute) => (
              <option key={minute} value={minute.toString().padStart(2, '0')}>
                {minute.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 text-right text-sm">{error}</p>}
    </div>
  );
});

export default SelectDateTime;
