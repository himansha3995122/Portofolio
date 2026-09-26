import { NavLink } from "react-router-dom";
import { useData } from "../context/DataContext";

export default function BottomNav() {
  const { navItems } = useData();
  const sorted = [...navItems].sort((a, b) => a.order - b.order);

  const linkClass = ({ isActive }) =>
    `font-mono text-[12.5px] px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
      isActive
        ? "bg-accent/10 text-accentStrong dark:text-accentStrong-dark"
        : "text-dim dark:text-dim-dark hover:text-ink dark:hover:text-ink-dark"
    }`;

  return (
    <div className="fixed inset-x-0 bottom-0 flex justify-center px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3.5 pointer-events-none">
      <nav className="pointer-events-auto flex gap-1 p-1.5 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-full shadow-lg max-w-full overflow-x-auto">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        {sorted.map((item) => (
          <NavLink key={item.id} to={`/${item.id}`} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
