export default function ProjectionCard({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  if (!salary) return null;

  // retirement projection assumptions
  const currentAge = 30;
  const retireAge = 65;
  const years = retireAge - currentAge;
  const annualReturn = 0.07; // 7% expected return
  const salaryGrowth = 0.03; // 3% annual salary increase

  // calculate annual contribution amount
  const annualContrib = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  // percentage contributions grow with salary, dollar amounts stay fixed
  const contribGrowth = type === "percentage" ? salaryGrowth : 0;

  // future value of growing annuity formula (handles compound growth)
  function fvAnnuity(C0, r, g, n) {
    // special case when growth rate equals return rate
    if (g === r) {
      return C0 * n * Math.pow(1 + r, n);
    }
    // standard growing annuity formula
    return C0 * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
  }

  const projected = fvAnnuity(annualContrib, annualReturn, contribGrowth, years);

  // calculate monthly retirement income using 4% withdrawal rule
  const monthlyIncome = (projected * 0.04) / 12;

  // sum total contributions over all years (accounts for growth if percentage type)
  let totalContribs = 0;
  for (let i = 1; i <= years; i++) {
    const yearContrib = annualContrib * Math.pow(1 + contribGrowth, i - 1);
    totalContribs += yearContrib;
  }

  // investment growth = total projected - total contributions
  const growth = projected - totalContribs;

  return (
    <div className="p-6 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-gray-border)] shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--hi-dark-navy)] mb-4">
        Projected Retirement Savings
      </h2>

      {/* MAIN PROJECTION AMT */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-[var(--hi-navy)] mb-1">
          ${Math.round(projected).toLocaleString()}
        </div>
        <p className="text-sm text-[var(--hi-neutral-mid)]">
          Estimated balance at age {retireAge}
        </p>
      </div>

      <div className="space-y-2 mb-4 pt-4 border-t border-[var(--hi-gray-border)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--hi-neutral-mid)]">Total Contributions:</span>
          <span className="font-semibold text-[var(--hi-navy)]">${Math.round(totalContribs).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--hi-neutral-mid)]">Investment Growth:</span>
          <span className="font-semibold text-[var(--hi-emerald)]">+${Math.round(growth).toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-[var(--hi-light-blue)] border border-[var(--hi-navy)] rounded">
        <p className="text-xs text-[var(--hi-dark-navy)] mb-1">
          <strong>Estimated Monthly Income:</strong>
        </p>
        <p className="text-lg font-bold text-[var(--hi-light-blue-dark)]">
          ${Math.round(monthlyIncome).toLocaleString()}/month
        </p>
        <p className="text-xs text-[var(--hi-neutral-mid)] mt-1">
          Based on 4% withdrawal rule (${Math.round(projected * 0.04).toLocaleString()}/year)
        </p>
      </div>

      {/* adding description for users */}
      <p className="text-xs text-[var(--hi-neutral-mid)] mt-4 italic">
        Assumes 7% annual return{type === "percentage" ? " and 3% salary increases" : ""}.
      </p>
    </div>
  );
}
