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
        className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 text-foreground bg-background"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    ) : (
      <input
        type="text"
        className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 text-foreground bg-background"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

export const renderOutput = (label: string, value: string) => (
  <div className="mt-2 break-all rounded-lg bg-background p-3">
    <p className="text-sm text-muted-foreground">{label}:</p>
    <p className="font-mono text-foreground">{value}</p>
  </div>
);

export const renderSelect = (label: string, value: string, onChange: (value: string) => void, options: string[]) => (
  <div>
    <label className="mb-2 block text-sm font-medium">{label}</label>
    <select
      className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 text-foreground bg-background"
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
