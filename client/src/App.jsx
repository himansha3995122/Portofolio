import { Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import SectionRouter from "./pages/SectionRouter";
import AdminPage from "./pages/admin/AdminPage";
import { useData } from "./context/DataContext";

export default function App() {
  const { loading, error } = useData();

  return (
    <div className="min-h-screen px-5 pb-24">
      <div className="max-w-[980px] mx-auto">
        <TopBar />

        {loading ? (
          <div className="py-24 text-center text-dim dark:text-dim-dark">Loading…</div>
        ) : error ? (
          <div className="py-24 text-center text-hard dark:text-hard-dark">
            Couldn't reach the server: {error}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/:id" element={<SectionRouter />} />
          </Routes>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
