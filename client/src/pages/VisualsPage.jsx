import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import Lightbox from "../components/Lightbox";
import { useData } from "../context/DataContext";
import { getYouTubeThumbnail } from "../utils/youtube";

export default function VisualsPage() {
  const { visuals } = useData();
  const items = [...visuals].sort((a, b) => a.order - b.order);
  const [index, setIndex] = useState(-1);

  return (
    <main className="py-14 pb-12">
      <SectionHeader
        tag="Visuals"
        title="Photography & VJ work"
        subtitle="Stills and visuals I've shot or run live — a mix of photography and VJ sets."
      />

      {items.length === 0 ? (
        <EmptyState>No visuals posted yet. Photos and VJ sets will show up here as they're added.</EmptyState>
      ) : (
        <div
          className="grid gap-3.5 mt-8"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              className="group relative rounded-2xl overflow-hidden border border-line dark:border-line-dark bg-surface2 dark:bg-surface2-dark aspect-[4/5] text-left"
            >
              <img
                src={item.videoUrl ? getYouTubeThumbnail(item.videoUrl) : item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.videoUrl && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white text-xl">
                    ▶
                  </span>
                </span>
              )}
              <span className="absolute top-2.5 left-2.5 font-mono text-[11px] tracking-wide uppercase text-white bg-black/55 backdrop-blur px-2.5 py-1 rounded-full">
                {item.category}
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3 pt-6 bg-gradient-to-t from-black/80 to-transparent text-white text-[12.5px] opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}

      <Lightbox
        items={items}
        index={index}
        onClose={() => setIndex(-1)}
        onPrev={() => setIndex((i) => (i - 1 + items.length) % items.length)}
        onNext={() => setIndex((i) => (i + 1) % items.length)}
      />
    </main>
  );
}
