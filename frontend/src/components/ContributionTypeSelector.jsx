export default function ContributionTypeSelector({ type, setType }) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <button
        onClick={() => setType("percentage")}
        className={`px-4 py-2 rounded-lg border transition 
          ${
            type === "percentage"
              ? "bg-[var(--hi-primary-blue)] text-[var(--hi-white)] border-[var(--hi-primary-blue)]"
              : "bg-[var(--hi-white)] text-[var(--hi-dark-navy)] border-[var(--hi-neutral-mid)]"
          }
        `}
      >
        Percentage (%)
      </button>

      <button
        onClick={() => setType("dollar")}
        className={`px-4 py-2 rounded-lg border transition 
          ${
            type === "dollar"
              ? "bg-[var(--hi-primary-blue)] text-[var(--hi-white)] border-[var(--hi-primary-blue)]"
              : "bg-[var(--hi-white)] text-[var(--hi-dark-navy)] border-[var(--hi-neutral-mid)]"
          }
        `}
      >
        Dollar ($)
      </button>
    </div>
  );
}
