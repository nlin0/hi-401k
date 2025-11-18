export default function MonthlyBreakdownCard({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  if (!salary) return null;

  const monthsPerYear = 12;

  // Calculate annual contribution
  const annualContribution = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  const perPaycheckContribution = annualContribution / paychecksPerYear;
  const monthlyContribution = annualContribution / monthsPerYear;

  return (
    <div className="mt-4 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <h3 className="font-semibold text-[var(--hi-dark-navy)] mb-3">
        Contribution Breakdown
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-[var(--hi-neutral-mid)] mb-1">Per Paycheck</div>
          <div className="text-xl font-bold text-[var(--hi-primary-blue)]">
            ${Math.round(perPaycheckContribution).toLocaleString()}
          </div>
          <div className="text-xs text-[var(--hi-neutral-mid)] mt-1">
            {paychecksPerYear} paychecks/year
          </div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xs text-[var(--hi-neutral-mid)] mb-1">Per Month</div>
          <div className="text-xl font-bold text-green-700">
            ${Math.round(monthlyContribution).toLocaleString()}
          </div>
          <div className="text-xs text-[var(--hi-neutral-mid)] mt-1">
            Monthly average
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--hi-neutral-mid)] pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[var(--hi-dark-navy)]">Annual Total:</span>
          <span className="text-lg font-bold text-[var(--hi-primary-blue)]">
            ${Math.round(annualContribution).toLocaleString()}
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

