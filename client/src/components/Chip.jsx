export default function Chip({ children }) {
  return (
    <span className="font-mono text-[12.5px] px-3.5 py-1.5 rounded-full border border-line dark:border-line-dark text-dim dark:text-dim-dark bg-surface dark:bg-surface-dark">
      {children}
    </span>
  );
}
