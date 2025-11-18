export default function ContributionTypeSelector({ type, setType }) {
  return (
    <div className="mb-4 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <label className="block text-sm font-semibold text-[var(--hi-dark-navy)] mb-3">
        Contribution Type
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => setType("percentage")}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition font-medium
            ${
              type === "percentage"
                ? "bg-[var(--hi-primary-blue)] text-[var(--hi-white)] border-[var(--hi-primary-blue)] shadow-sm"
                : "bg-[var(--hi-white)] text-[var(--hi-dark-navy)] border-[var(--hi-neutral-mid)] hover:border-[var(--hi-primary-blue)]"
            }
          `}
        >
          Percentage (%)
        </button>

        <button
          onClick={() => setType("dollar")}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition font-medium
            ${
              type === "dollar"
                ? "bg-[var(--hi-primary-blue)] text-[var(--hi-white)] border-[var(--hi-primary-blue)] shadow-sm"
                : "bg-[var(--hi-white)] text-[var(--hi-dark-navy)] border-[var(--hi-neutral-mid)] hover:border-[var(--hi-primary-blue)]"
            }
          `}
        >
          Dollar ($)
        </button>
      </div>
    </div>
  );
}
