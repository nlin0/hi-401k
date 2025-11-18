export default function DeltaComparisonCard({ salary, type, contributionValue }) {
  if (!salary) return null;

  const currentAge = 30;
  const retireAge = 65;
  const years = retireAge - currentAge;

  const annualReturn = 0.07;
  const salaryGrowth = 0.03;
  const paychecks = 26;

  // Convert current settings to annual dollars
  const annualContribution =
    type === "percentage"
      ? salary * (contributionValue / 100)
      : contributionValue * paychecks;

  // Contribution if increased by +1% (only apply to percentage mode)
  const annualContributionPlusOne =
    type === "percentage"
      ? salary * ((contributionValue + 1) / 100)
      : annualContribution; // same for dollar mode

  // Growth rate: percentage contributions grow with salary, fixed dollar amounts stay fixed
  const contributionGrowth = type === "percentage" ? salaryGrowth : 0;

  // Growing annuity FV formula
  function FV(C0, r, g, n) {
    // If growth rate equals return rate, use simpler formula
    if (g === r) {
      return C0 * n * Math.pow(1 + r, n);
    }
    return C0 * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
  }

  const currentFV = FV(annualContribution, annualReturn, contributionGrowth, years);
  const plusOneFV = FV(annualContributionPlusOne, annualReturn, contributionGrowth, years);

  const delta = plusOneFV - currentFV;

  return (
    <div className="mt-4 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <h3 className="font-semibold text-[var(--hi-dark-navy)] mb-1">
        How much would +1% add?
      </h3>

      <p className="text-[var(--hi-neutral-mid)] text-sm mb-2">
        Increasing your contribution by 1%
        {type === "dollar" && " (percentage mode only)"}
        {" "}could grow your retirement balance by:
      </p>

      <div className="text-xl font-bold text-green-700">
        +${Math.round(delta).toLocaleString()}
      </div>
    </div>
  );
}
