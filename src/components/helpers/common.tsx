export const renderInput = (
  label: string,
  value: string,
  onChange: (value: string) => void,
  placeholder: string,
  rows = 1,
) => (
  <div>
    <label className="mb-2 block text-sm font-medium">{label}</label>
    {rows > 1 ? (
      <textarea
        className="focus:ring-primary w-full rounded-lg border border-gray-600 bg-gray-700 p-3 focus:ring-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    ) : (
      <input
        type="text"
        className="focus:ring-primary w-full rounded-lg border border-gray-600 bg-gray-700 p-3 focus:ring-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

export const renderOutput = (label: string, value: string) => (
  <div className="mt-2 break-all rounded-lg bg-gray-800 p-3">
    <p className="text-sm text-gray-400">{label}:</p>
    <p className="font-mono">{value}</p>
  </div>
);

export const renderSelect = (label: string, value: string, onChange: (value: string) => void, options: string[]) => (
  <div>
    <label className="mb-2 block text-sm font-medium">{label}</label>
    <select
      className="focus:ring-primary w-full rounded-lg border border-gray-600 bg-gray-700 p-3 focus:ring-2"
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
