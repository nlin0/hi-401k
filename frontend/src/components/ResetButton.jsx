export default function ResetButton({ onReset, loading }) {
  return (
    <button
      onClick={onReset}
      disabled={loading}
      className="mt-3 w-full bg-[var(--hi-white)] text-[var(--hi-dark-navy)]
      py-3 rounded-lg text-lg font-semibold border border-[var(--hi-neutral-mid)]
      hover:bg-[var(--hi-neutral-light)] transition disabled:bg-gray-300"
    >
      Reset to Default
    </button>
  );
}
