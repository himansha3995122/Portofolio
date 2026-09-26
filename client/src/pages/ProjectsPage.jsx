import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import Chip from "../components/Chip";
import { useData } from "../context/DataContext";

export default function ProjectsPage() {
  const { projects } = useData();
  const items = [...projects].sort((a, b) => a.order - b.order);

  return (
    <main className="py-14 pb-12">
      <SectionHeader
        tag="Software Engineering"
        title="Projects & work"
        subtitle="Things I've built, from side projects to production code."
      />
      {items.length === 0 ? (
        <EmptyState>No projects listed yet — check back soon.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3.5 mt-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-line dark:border-line-dark rounded-2xl p-5 bg-surface dark:bg-surface-dark"
            >
              <h3 className="text-xl mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-dim dark:text-dim-dark leading-relaxed m-0">{item.description}</p>
              )}
              {item.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3.5">
                  {item.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3.5 font-mono text-[12.5px] text-accentStrong dark:text-accentStrong-dark hover:underline"
                >
                  View project ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
