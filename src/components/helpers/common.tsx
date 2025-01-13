export const renderInput = (label: string, value: string, onChange: (value: string) => void, placeholder: string, rows = 1) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {rows > 1 ? (
      <textarea
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    ) : (
      <input
        type="text"
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

export const renderOutput = (label: string, value: string) => (
  <div className="mt-2 p-3 bg-gray-800 rounded-lg break-all">
    <p className="text-sm text-gray-400">{label}:</p>
    <p className="font-mono">{value}</p>
  </div>
);

export const renderSelect = (label: string, value: string, onChange: (value: string) => void, options: string[]) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <select 
      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
); 