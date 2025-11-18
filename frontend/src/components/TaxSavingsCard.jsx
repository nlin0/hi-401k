export default function TaxSavingsCard({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  if (!salary) return null;

  const taxRate = 0.22;

  // calculate annual contribution
  const annualContrib = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  const contribPct = salary > 0 ? (annualContrib / salary) * 100 : 0;
  const taxSavings = annualContrib * taxRate;
  const effectiveCost = annualContrib - taxSavings;

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-gray-border)] shadow-sm">
      <h3 className="font-semibold text-[var(--hi-dark-navy)] mb-3">
        Tax Savings (Traditional 401k)
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--hi-neutral-mid)]">Annual Contribution:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--hi-primary-blue)]">
              ${Math.round(annualContrib).toLocaleString()}/year
            </span>
            {type === "dollar" && (
              <span className="text-xs text-[var(--hi-neutral-mid)]">
                ({contribPct.toFixed(1)}% of salary)
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--hi-neutral-mid)]">Annual Tax Savings (est. {taxRate * 100}%):</span>
          <span className="font-semibold text-[var(--hi-primary-blue)]">
            -${Math.round(taxSavings).toLocaleString()}/year
          </span>
        </div>

        <div className="border-t border-[var(--hi-gray-border)] pt-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-[var(--hi-dark-navy)]">Effective Annual Cost:</span>
          <span className="text-lg font-bold text-[var(--hi-navy)]">
            ${Math.round(effectiveCost).toLocaleString()}/year
          </span>
        </div>

        <p className="text-xs text-[var(--hi-neutral-mid)] mt-3 italic">
          Tax savings are estimates based on a {taxRate * 100}% marginal tax rate.
          You'll pay taxes when you withdraw in retirement.
        </p>
      </div>
    </div>
  );
}

