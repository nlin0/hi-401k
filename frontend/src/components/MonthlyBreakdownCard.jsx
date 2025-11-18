export default function MonthlyBreakdownCard({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  if (!salary) return null;

  const monthsPerYear = 12;

  // calculate annual contribution
  const annualContrib = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  const perPaycheck = annualContrib / paychecksPerYear;
  const monthly = annualContrib / monthsPerYear;

  return (
    <div className="mt-4 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-gray-border)] shadow-sm">
      <h3 className="font-semibold text-[var(--hi-dark-navy)] mb-3">
        Contribution Breakdown
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center p-3 bg-[var(--hi-light-blue)] rounded-lg">
          <div className="text-xs text-[var(--hi-neutral-mid)] mb-1">Per Paycheck</div>
          <div className="text-xl font-bold text-[var(--hi-light-blue-dark)]">
            ${Math.round(perPaycheck).toLocaleString()}
          </div>
          <div className="text-xs text-[var(--hi-neutral-mid)] mt-1">
            {paychecksPerYear} paychecks/year
          </div>
        </div>

        <div className="text-center p-3 bg-[var(--hi-navy-light)] rounded-lg">
          <div className="text-xs text-[var(--hi-neutral-mid)] mb-1">Per Month</div>
          <div className="text-xl font-bold text-[var(--hi-navy-light-dark)]">
            ${Math.round(monthly).toLocaleString()}
          </div>
          <div className="text-xs text-[var(--hi-neutral-mid)] mt-1">
            Monthly average
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--hi-gray-border)] pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[var(--hi-dark-navy)]">Annual Total:</span>
          <span className="text-lg font-bold text-[var(--hi-navy)]">
            ${Math.round(annualContrib).toLocaleString()}/year
          </span>
        </div>
        {type === "percentage" && (
          <p className="text-xs text-[var(--hi-neutral-mid)] mt-1">
            {contributionValue}% of ${salary.toLocaleString()} salary
          </p>
        )}
      </div>
    </div>
  );
}

