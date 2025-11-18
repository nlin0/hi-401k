export default function ProjectionCard({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  if (!salary) return null;

  const currentAge = 30;       // this is mocked...
  const retireAge = 65;
  const years = retireAge - currentAge;

  const annualReturn = 0.07;   // 7% return
  const salaryGrowth = 0.03;   // 3% salary increase

  // convert contribution to dollars
  const annualContribution =
    type === "percentage"
      ? (salary * (contributionValue / 100))
      : (contributionValue * paychecksPerYear);

  // percentage contributions grow with salary, keeping dollar amounts fixed
  const contributionGrowth = type === "percentage" ? salaryGrowth : 0;

  // future value
  function futureValueOfGrowingContributions(C0, r, g, n) {
    // FV of a growing annuity
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

  // calculate monthly income at retirement (4% withdrawal)
  const monthlyRetirementIncome = (projectedSavings * 0.04) / 12;

  // total contributions over time
  let totalContributions = 0;
  for (let i = 1; i <= years; i++) {
    const yearContribution = annualContribution * Math.pow(1 + contributionGrowth, i - 1);
    totalContributions += yearContribution;
  }

  const growthAmount = projectedSavings - totalContributions;

  return (
    <div className="p-6 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--hi-dark-navy)] mb-4">
        Projected Retirement Savings
      </h2>

      {/* MAIN PROJECTION AMT */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-[var(--hi-primary-blue)] mb-1">
          ${Math.round(projectedSavings).toLocaleString()}
        </div>
        <p className="text-sm text-[var(--hi-neutral-mid)]">
          Estimated balance at age {retireAge}
        </p>
      </div>

      {/* BREAKDOWN STARTS HERE */}
      <div className="space-y-2 mb-4 pt-4 border-t border-[var(--hi-neutral-mid)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--hi-neutral-mid)]">Total Contributions:</span>
          <span className="font-semibold text-[var(--hi-dark-navy)]">${Math.round(totalContributions).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--hi-neutral-mid)]">Investment Growth:</span>
          <span className="font-semibold text-green-600">+${Math.round(growthAmount).toLocaleString()}</span>
        </div>
      </div>

      {/* monthly income estimate */}
      <div className="mt-4 p-3 bg-blue-50 border border-[var(--hi-primary-blue)] rounded">
        <p className="text-xs text-[var(--hi-dark-navy)] mb-1">
          <strong>Estimated Monthly Income:</strong>
        </p>
        <p className="text-lg font-bold text-[var(--hi-primary-blue)]">
          ${Math.round(monthlyRetirementIncome).toLocaleString()}/month
        </p>
        <p className="text-xs text-[var(--hi-neutral-mid)] mt-1">
          Based on 4% withdrawal rule (${Math.round(projectedSavings * 0.04).toLocaleString()}/year)
        </p>
      </div>

      {/* adding description for users */}
      <p className="text-xs text-[var(--hi-neutral-mid)] mt-4 italic">
        Assumes 7% annual return{type === "percentage" ? " and 3% salary increases" : ""}.
      </p>
    </div>
  );
}
