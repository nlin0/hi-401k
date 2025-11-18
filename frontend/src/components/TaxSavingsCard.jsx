export default function TaxSavingsCard({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  if (!salary) return null;

  // Assume pre-tax contributions (Traditional 401k)
  // Using a typical marginal tax rate (would be personalized in production)
  const estimatedMarginalTaxRate = 0.22; // 22% federal (could add state)

  // Calculate annual contribution and percentage
  const annualContribution = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  const contributionPercentage = salary > 0
    ? (annualContribution / salary) * 100
    : 0;

  // Tax savings = contribution amount * marginal tax rate
  const annualTaxSavings = annualContribution * estimatedMarginalTaxRate;

  // Effective cost after tax savings
  const effectiveAnnualCost = annualContribution - annualTaxSavings;

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <h3 className="font-semibold text-[var(--hi-dark-navy)] mb-3">
        Tax Savings (Traditional 401k)
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--hi-neutral-mid)]">Annual Contribution:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--hi-dark-navy)]">${Math.round(annualContribution).toLocaleString()}</span>
            {type === "dollar" && (
              <span className="text-xs text-[var(--hi-neutral-mid)]">
                ({contributionPercentage.toFixed(1)}% of salary)
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--hi-neutral-mid)]">Annual Tax Savings (est. {estimatedMarginalTaxRate * 100}%):</span>
          <span className="font-semibold text-[var(--hi-primary-blue)]">-${Math.round(annualTaxSavings).toLocaleString()}</span>
        </div>

        <div className="border-t border-[var(--hi-neutral-mid)] pt-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-[var(--hi-dark-navy)]">Effective Annual Cost:</span>
          <span className="text-lg font-bold text-[var(--hi-primary-blue)]">${Math.round(effectiveAnnualCost).toLocaleString()}</span>
        </div>

        <p className="text-xs text-[var(--hi-neutral-mid)] mt-3 italic">
          Tax savings are estimates based on a {estimatedMarginalTaxRate * 100}% marginal tax rate.
          You'll pay taxes when you withdraw in retirement.
        </p>
      </div>
    </div>
  );
}

