export default function ProjectionCard({ salary, contributionValue, type }) {
  if (!salary) return null;

  const currentAge = 30;       // mocked – could be a prop
  const retireAge = 65;
  const years = retireAge - currentAge;

  const annualReturn = 0.07;   // 7% return
  const salaryGrowth = 0.03;   // 3% salary increase
  const paychecks = 26;

  // 1. Convert current contribution to annual dollar amount
  const annualContribution =
    type === "percentage"
      ? (salary * (contributionValue / 100))
      : (contributionValue * paychecks);

  // 2. Growth rate: percentage contributions grow with salary, fixed dollar amounts stay fixed
  const contributionGrowth = type === "percentage" ? salaryGrowth : 0;

  // 3. Future value of a series of growing contributions
  function futureValueOfGrowingContributions(C0, r, g, n) {
    // Standard finance formula for FV of a growing annuity
    // If growth rate equals return rate, use simpler formula
    if (g === r) {
      return C0 * n * Math.pow(1 + r, n);
    }
    return C0 * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
  }

  const projectedSavings = futureValueOfGrowingContributions(
    annualContribution,
    annualReturn,
    contributionGrowth,
    years
  );

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--hi-dark-navy)] mb-2">
        Projected Retirement Savings
      </h2>

      <p className="text-[var(--hi-neutral-mid)] mb-3">
        Based on your current contribution settings and typical market returns.
      </p>

      <div className="text-2xl font-bold text-[var(--hi-primary-blue)]">
        ${Math.round(projectedSavings).toLocaleString()}
      </div>

      <p className="text-[var(--hi-neutral-mid)] mt-2 text-sm">
        Estimated balance at age 65 assuming 7% annual growth
        {type === "percentage" ? " and 3% salary increases." : " with fixed contributions."}
      </p>
    </div>
  );
}
