export default function Toast({ message, show }) {
  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-[var(--hi-white)]
        bg-[var(--hi-primary-blue)] transition-opacity duration-300
        ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {message}
    </div>
  );
}

