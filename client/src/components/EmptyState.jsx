export default function EmptyState({ children }) {
  return (
    <div className="mt-8 border border-dashed border-line dark:border-line-dark rounded-2xl p-9 px-6">
      <p className="m-0 text-dim dark:text-dim-dark max-w-[44ch] leading-relaxed">{children}</p>
    </div>
  );
}
