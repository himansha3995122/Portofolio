import { useEffect } from "react";

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  if (index < 0 || !items.length) return null;
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/90 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        className="fixed top-5 right-5 w-10 h-10 rounded-full border border-white/25 bg-white/10 text-white flex items-center justify-center text-lg"
      >
        &times;
      </button>
      <button
        onClick={onPrev}
        className="fixed left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/25 bg-white/10 text-white flex items-center justify-center text-lg"
      >
        &larr;
      </button>
      <button
        onClick={onNext}
        className="fixed right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/25 bg-white/10 text-white flex items-center justify-center text-lg"
      >
        &rarr;
      </button>
      <figure className="m-0 max-w-[min(880px,92vw)] max-h-[88vh] flex flex-col items-center gap-3">
        <img src={item.imageUrl} alt={item.title} className="max-w-full max-h-[76vh] rounded-lg object-contain" />
        <figcaption className="text-white/90 text-sm text-center max-w-[60ch]">
          <span className="block font-mono text-[11px] tracking-wide uppercase text-emerald-300 mb-1">
            {item.category}
          </span>
          {item.caption || item.title}
        </figcaption>
      </figure>
    </div>
  );
}
