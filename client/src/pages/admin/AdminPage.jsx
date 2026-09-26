import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLogin from "./AdminLogin";
import ProfileTab from "./tabs/ProfileTab";
import NavTab from "./tabs/NavTab";
import VisualsTab from "./tabs/VisualsTab";
import ProjectsTab from "./tabs/ProjectsTab";
import BooksTab from "./tabs/BooksTab";
import LeetcodeTab from "./tabs/LeetcodeTab";

const TABS = [
  { key: "profile", label: "Profile", Component: ProfileTab },
  { key: "nav", label: "Navigation", Component: NavTab },
  { key: "visuals", label: "Visuals", Component: VisualsTab },
  { key: "projects", label: "Projects", Component: ProjectsTab },
  { key: "books", label: "Books", Component: BooksTab },
  { key: "leetcode", label: "LeetCode", Component: LeetcodeTab },
];

export default function AdminPage() {
  const { isAdmin, logout } = useAuth();
  const [tab, setTab] = useState("profile");
  const Active = TABS.find((t) => t.key === tab)?.Component;

  return (
    <main className="py-14 pb-12">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <span className="block font-mono text-xs tracking-[0.12em] uppercase text-accent dark:text-accent-dark mb-2.5">
            Admin
          </span>
          <h2 className="text-3xl">Site content</h2>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={logout}
              className="font-mono text-[12.5px] text-dim dark:text-dim-dark hover:text-accent dark:hover:text-accent-dark"
            >
              log out
            </button>
          )}
          <Link
            to="/"
            className="font-mono text-[12.5px] text-dim dark:text-dim-dark hover:text-accent dark:hover:text-accent-dark"
          >
            &larr;&nbsp; back to site
          </Link>
        </div>
      </div>

      {!isAdmin ? (
        <AdminLogin />
      ) : (
        <>
          <div className="flex gap-1.5 flex-wrap py-7">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`font-mono text-[12.5px] px-3.5 py-1.5 rounded-lg border ${
                  tab === t.key
                    ? "bg-accent/10 text-accentStrong dark:text-accentStrong-dark border-accent dark:border-accent-dark"
                    : "bg-surface2 dark:bg-surface2-dark text-dim dark:text-dim-dark border-line dark:border-line-dark"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="max-w-[640px]">{Active && <Active />}</div>
        </>
      )}
    </main>
  );
}
