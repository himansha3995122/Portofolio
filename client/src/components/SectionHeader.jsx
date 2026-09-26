import { Link } from "react-router-dom";

export default function SectionHeader({ tag, title, subtitle }) {
  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-[12.5px] text-dim dark:text-dim-dark mb-8 hover:text-accent dark:hover:text-accent-dark"
      >
        &larr;&nbsp; back to home
      </Link>
      <span className="block font-mono text-xs tracking-[0.12em] uppercase text-accent dark:text-accent-dark mb-2.5">
        {tag}
      </span>
      <h2 className="text-[clamp(1.9rem,4.4vw,2.7rem)]">{title}</h2>
      {subtitle && (
        <p className="mt-3.5 text-dim dark:text-dim-dark max-w-[52ch] leading-relaxed">{subtitle}</p>
      )}
    </>
  );
}
