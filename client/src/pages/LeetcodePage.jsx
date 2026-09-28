import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import { useData } from "../context/DataContext";

function diffClass(d) {
  if (d === "Easy") return "text-easy dark:text-easy-dark bg-easy/10 dark:bg-easy-dark/10";
  if (d === "Hard") return "text-hard dark:text-hard-dark bg-hard/10 dark:bg-hard-dark/10";
  return "text-medium dark:text-medium-dark bg-medium/10 dark:bg-medium-dark/10";
}

export default function LeetcodePage() {
  const { leetcode } = useData();
  const items = [...leetcode].sort((a, b) => a.order - b.order);

  return (
    <main className="py-14 pb-12">
      <SectionHeader tag="LeetCode" title="Problems solved" subtitle="A log of problems I've worked through." />
      {items.length === 0 ? (
        <EmptyState>No problems logged yet — check back soon.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3.5 mt-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-line dark:border-line-dark rounded-2xl px-5 py-3.5 bg-surface dark:bg-surface-dark flex flex-wrap items-center gap-3.5"
            >
              <span className="font-medium flex-1 min-w-[160px]">{item.title}</span>
              <span className={`font-mono text-[11px] tracking-wide uppercase px-2.5 py-1 rounded-full ${diffClass(item.difficulty)}`}>
                {item.difficulty}
              </span>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-accentStrong dark:text-accentStrong-dark hover:underline"
                >
                  Problem ↗
                </a>
              )}
              {item.notes && (
                <p className="w-full m-0 text-dim dark:text-dim-dark text-sm leading-relaxed">{item.notes}</p>
              )}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full max-w-xs rounded-lg border border-line dark:border-line-dark"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
