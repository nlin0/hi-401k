import { useState, useEffect } from "react";

export default function ContributionInput({ type, value, setValue, salary, paychecksPerYear = 26 }) {
  const [localValue, setLocalValue] = useState(String(value));

  // Sync local value when prop value changes (e.g., from API load)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  // Quick action buttons for common contribution percentages
  const quickActions = [3, 6, 10, 15];

  return (
    <div className="mb-6 p-5 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      {type === "percentage" ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <label className="block font-semibold text-[var(--hi-dark-navy)]">
              Contribution Percentage
            </label>
            <div className="text-2xl font-bold text-[var(--hi-primary-blue)]">{value}%</div>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-[var(--hi-primary-blue)] mb-3"
          />
          {/* Quick action buttons */}
          <div className="flex gap-2 justify-center">
            {quickActions.map((percent) => (
              <button
                key={percent}
                onClick={() => setValue(percent)}
                className={`px-4 py-2 text-sm rounded-lg transition font-medium ${
                  value === percent
                    ? "bg-[var(--hi-primary-blue)] text-[var(--hi-white)] shadow-sm"
                    : "bg-[var(--hi-neutral-light)] text-[var(--hi-dark-navy)] hover:bg-[var(--hi-primary-blue)] hover:text-[var(--hi-white)]"
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
          {salary && (
            <p className="text-xs text-[var(--hi-neutral-mid)] mt-3 text-center">
              ${Math.round((salary * value / 100) / (paychecksPerYear || 26)).toLocaleString()} per paycheck
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <label className="block font-semibold text-[var(--hi-dark-navy)]">
              Contribution per Paycheck
            </label>
            <div className="text-2xl font-bold text-[var(--hi-primary-blue)]">
              ${localValue || 0}
            </div>
          </div>
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
            className="w-full border-2 border-[var(--hi-neutral-mid)] p-3 rounded-lg text-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20 text-center font-semibold"
            placeholder="0"
          />
          {/* Calculate and show percentage of salary */}
          {salary && (() => {
            const annualContribution = Number(localValue || 0) * paychecksPerYear;
            const percentage = salary > 0 ? (annualContribution / salary) * 100 : 0;
            if (!isNaN(percentage) && localValue !== "" && localValue !== "-" && localValue !== ".") {
              return (
                <div className="text-sm text-[var(--hi-neutral-mid)] mt-3 text-center">
                  {percentage > 0 && percentage <= 100 ? (
                    <><strong className="text-[var(--hi-primary-blue)]">{percentage.toFixed(1)}%</strong> of ${salary.toLocaleString()} salary/year</>
                  ) : (
                    <>Enter a dollar amount per paycheck</>
                  )}
                </div>
              );
            }
            return null;
          })()}
        </>
      )}
    </div>
  );
}
