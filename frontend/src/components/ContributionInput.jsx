import { useState, useEffect } from "react";

export default function ContributionInput({ type, value, setValue, salary, paychecksPerYear = 26 }) {
  // local state for dollar input (string to allow typing intermediate states like "12.")
  const [localValue, setLocalValue] = useState(String(value));

  // sync local value when prop value changes (e.g., from API load or type switch)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  // quick action buttons for common contribution percentages
  const quickActions = [3, 6, 10, 15];

  return (
    <div className="mb-6 p-5 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-gray-border)] shadow-sm">
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
            style={{
              "--value": `${(value / 20) * 100}%`
            }}
            className="w-full mb-3"
          />
          {/* ACTION BUTTONS ARE HERE */}
          <div className="flex gap-2 justify-center">
            {quickActions.map((percent) => (
              <button
                key={percent}
                onClick={() => setValue(percent)}
                className={`px-4 py-2 text-sm rounded-lg transition font-medium ${value === percent
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
            <div className="text-2xl font-bold text-[var(--hi-navy)]">
              ${localValue || 0}
            </div>
          </div>
          <input
            type="number"
            value={localValue}
            onChange={(e) => {
              const inputVal = e.target.value;
              setLocalValue(inputVal);

              // allow intermediate states while typing (empty, "-", ".")
              if (inputVal === "" || inputVal === "-" || inputVal === ".") {
                return;
              }

              // update parent value if valid number
              const numVal = Number(inputVal);
              if (!isNaN(numVal) && inputVal !== "") {
                setValue(numVal);
              }
            }}
            onBlur={() => {
              // validate and clean up value when user leaves input
              const numVal = Number(localValue);
              if (isNaN(numVal) || localValue === "") {
                setLocalValue(String(value || 0));
                setValue(value || 0);
              } else {
                setLocalValue(String(numVal));
                setValue(numVal);
              }
            }}
            className="w-full border-2 border-[var(--hi-gray-border)] p-3 rounded-lg text-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20 text-center font-semibold"
            placeholder="0"
          />
          {salary && (() => {
            const annualContrib = Number(localValue || 0) * paychecksPerYear;
            const pct = salary > 0 ? (annualContrib / salary) * 100 : 0;
            if (!isNaN(pct) && localValue !== "" && localValue !== "-" && localValue !== ".") {
              return (
                <div className="text-sm text-[var(--hi-neutral-mid)] mt-3 text-center">
                  {pct > 0 && pct <= 100 ? (
                    <><strong className="text-[var(--hi-navy)]">{pct.toFixed(1)}%</strong> of ${salary.toLocaleString()} salary/year</>
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
