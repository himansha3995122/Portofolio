export default function IconButton({ label, title, disabled, onClick }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md border border-line dark:border-line-dark bg-bg dark:bg-bg-dark text-dim dark:text-dim-dark text-xs hover:text-accent dark:hover:text-accent-dark hover:border-accent dark:hover:border-accent-dark disabled:opacity-40 disabled:pointer-events-none"
    >
      {label}
    </button>
  );
}
