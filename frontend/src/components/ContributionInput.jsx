import { useState, useEffect } from "react";

export default function ContributionInput({ type, value, setValue }) {
  const [localValue, setLocalValue] = useState(String(value));

  // Sync local value when prop value changes (e.g., from API load)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  return (
    <div className="mb-6">
      {type === "percentage" ? (
        <>
          <label className="block font-semibold mb-1 text-[var(--hi-dark-navy)]">
            Contribution Percentage
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-[var(--hi-primary-blue)]"
          />
          <div className="text-[var(--hi-neutral-mid)] mt-2">{value}%</div>
        </>
      ) : (
        <>
          <label className="block font-semibold mb-1 text-[var(--hi-dark-navy)]">
            Contribution per Paycheck ($)
          </label>
          <input
            type="number"
            value={localValue}
            onChange={(e) => {
              const inputValue = e.target.value;
              setLocalValue(inputValue);

              // Only update parent value if input is a valid number
              if (inputValue === "" || inputValue === "-" || inputValue === ".") {
                // Allow intermediate states while typing (empty, minus, decimal point)
                return;
              }

              const numValue = Number(inputValue);
              if (!isNaN(numValue) && inputValue !== "") {
                setValue(numValue);
              }
            }}
            onBlur={() => {
              // When user leaves the field, ensure we have a valid number
              const numValue = Number(localValue);
              if (isNaN(numValue) || localValue === "") {
                setLocalValue(String(value || 0));
                setValue(value || 0);
              } else {
                setLocalValue(String(numValue));
                setValue(numValue);
              }
            }}
            className="w-full border border-[var(--hi-neutral-mid)] p-2 rounded-lg"
          />
        </>
      )}
    </div>
  );
}
