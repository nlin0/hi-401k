export default function YTDPanel({ ytd }) {
  if (!ytd) return null;

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)]">
      <h2 className="text-lg font-semibold mb-2 text-[var(--hi-dark-navy)]">
        Year-to-Date Contributions
      </h2>

      <div className="text-[var(--hi-neutral-mid)] space-y-1">
        <p><strong className="text-[var(--hi-dark-navy)]">Salary:</strong> ${ytd.salary.toLocaleString()}</p>
        <p><strong className="text-[var(--hi-dark-navy)]">Paychecks/year:</strong> {ytd.paychecks_per_year}</p>
        <p><strong className="text-[var(--hi-dark-navy)]">YTD Contributions:</strong> ${ytd.ytd_contributions.toLocaleString()}</p>
      </div>
    </div>
  );
}
