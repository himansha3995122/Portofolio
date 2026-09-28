import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import { useData } from "../context/DataContext";

function stars(rating) {
  const n = parseInt(rating, 10) || 0;
  return "★".repeat(n) + "☆".repeat(5 - n);
}
function statusClass(status) {
  if (status === "Reading") return "bg-accent/10 text-accentStrong dark:text-accentStrong-dark border-transparent";
  if (status === "Read") return "bg-surface2 dark:bg-surface2-dark text-ink dark:text-ink-dark";
  return "text-dim dark:text-dim-dark";
}

export default function BooksPage() {
  const { books } = useData();
  const items = [...books].sort((a, b) => a.order - b.order);

  return (
    <main className="py-14 pb-12">
      <SectionHeader
        tag="Books"
        title="What I'm reading"
        subtitle="A running shelf of what I've read, I'm reading, and want to get to."
      />
      {items.length === 0 ? (
        <EmptyState>No books logged yet — check back soon.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3.5 mt-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-line dark:border-line-dark rounded-2xl px-5 py-4 bg-surface dark:bg-surface-dark flex gap-4"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-24 object-cover rounded-lg flex-none border border-line dark:border-line-dark"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div>
                    <div className="font-display font-semibold text-lg">{item.title}</div>
                    {item.author && (
                      <div className="text-dim dark:text-dim-dark text-sm mt-0.5">{item.author}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`font-mono text-[11px] tracking-wide uppercase px-2.5 py-1 rounded-full border border-line dark:border-line-dark ${statusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    {parseInt(item.rating, 10) > 0 && (
                      <span className="text-accent dark:text-accent-dark text-sm tracking-wider">
                        {stars(item.rating)}
                      </span>
                    )}
                  </div>
                </div>
                {item.notes && (
                  <p className="mt-2.5 text-dim dark:text-dim-dark text-sm leading-relaxed">{item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
