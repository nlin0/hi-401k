export default function CurrentContributionIndicator({ type, value, salary, paychecksPerYear = 26 }) {
  const annualContrib = salary && type && value !== undefined && value !== null
    ? (type === "percentage"
      ? salary * (value / 100)
      : value * paychecksPerYear)
    : 0;

  return (
    <div className="px-6 py-3 rounded-lg bg-transparent border border-[var(--hi-gray-border)] shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-[var(--hi-neutral-mid)] whitespace-nowrap">
            Current Contribution:
          </div>
          <div className="text-xl font-bold text-[var(--hi-primary-blue)]">
            {type === "percentage" ? `${value}%` : `$${value.toLocaleString()}`}
            {type === "dollar" && <span className="text-sm font-normal text-[var(--hi-neutral-mid)] ml-1.5">/paycheck</span>}
          </div>
        </div>
        <div className="h-8 w-px bg-[var(--hi-gray-border)] bg-opacity-30"></div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-[var(--hi-neutral-mid)] whitespace-nowrap">
            Annual Total:
          </div>
          <div className="text-xl font-bold text-[var(--hi-primary-blue)]">
            ${Math.round(annualContrib).toLocaleString()}<span className="text-sm font-normal text-[var(--hi-neutral-mid)] ml-1.5">/year</span>
          </div>
        </div>
      </div>
    </div>
  );
}

