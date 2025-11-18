export default function SaveButton({ onSave, loading }) {
  return (
    <button
      onClick={onSave}
      disabled={loading}
      className="mt-4 w-full bg-[var(--hi-primary-blue)] text-[var(--hi-white)] 
      py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition 
      disabled:bg-[var(--hi-neutral-mid)] disabled:text-[var(--hi-white)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Saving..." : "Save Contribution Settings"}
    </button>
  );
}
