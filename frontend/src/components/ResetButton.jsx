export default function ResetButton({ onReset, disabled }) {
  return (
    <button
      onClick={onReset}
      disabled={disabled}
      className="mt-3 w-full bg-[var(--hi-white)] text-[var(--hi-dark-navy)]
      py-3 rounded-lg text-lg font-semibold border border-[var(--hi-gray-border)]
      hover:bg-[var(--hi-neutral-light)] transition disabled:bg-[var(--hi-gray-border)] disabled:text-[var(--hi-gray-text)]"
    >
      View Current Contribution
    </button>
  );
}
