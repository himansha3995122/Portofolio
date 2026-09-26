import { useData } from "../context/DataContext";
import Chip from "./Chip";

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function Hero() {
  const { profile } = useData();

  return (
    <section className="grid md:grid-cols-[1.15fr_.85fr] gap-9 md:gap-14 items-center py-8 md:py-16 w-full">
      <div className="order-2 md:order-1">
        <span className="font-mono text-xs tracking-[0.14em] uppercase text-accent dark:text-accent-dark mb-3.5 inline-block">
          Portfolio
        </span>
        <h1 className="text-[clamp(2.4rem,5.2vw,3.8rem)] font-bold leading-[1.05]">
          {profile.name || "Your Name"}
        </h1>
        {profile.title && (
          <p className="mt-2.5 text-lg text-dim dark:text-dim-dark font-medium">{profile.title}</p>
        )}
        <p
          className={`mt-5 text-[1.02rem] leading-relaxed max-w-[56ch] ${
            profile.bio ? "" : "text-dim dark:text-dim-dark"
          }`}
        >
          {profile.bio || "Add a bio from the admin panel."}
        </p>
        {profile.chips?.length > 0 && (
          <div className="mt-6 flex gap-2.5 flex-wrap">
            {profile.chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
      </div>

      <div className="order-1 md:order-2 flex justify-center">
        <div
          className="relative w-[min(320px,80vw)] aspect-[1/1.1] rounded-[22px] overflow-hidden border border-line dark:border-line-dark bg-surface2 dark:bg-surface2-dark text-line dark:text-line-dark shadow-sm"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1.4px)",
            backgroundSize: "16px 16px",
          }}
        >
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-display font-semibold text-6xl text-accent dark:text-accent-dark">
              {initials(profile.name)}
            </div>
          )}
          <div className="absolute inset-3.5 border-[1.5px] border-accent dark:border-accent-dark rounded-2xl opacity-55 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
