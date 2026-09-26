import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client";

const DataContext = createContext(null);

const EMPTY_STATE = {
  profile: { name: "", title: "", bio: "", chips: [], photoUrl: "" },
  navItems: [],
  visuals: [],
  projects: [],
  books: [],
  leetcode: [],
};

export function DataProvider({ children }) {
  const [data, setData] = useState(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, navItems, visuals, projects, books, leetcode] = await Promise.all([
        api.getProfile(),
        api.getNav(),
        api.getCollection("visuals"),
        api.getCollection("projects"),
        api.getCollection("books"),
        api.getCollection("leetcode"),
      ]);
      setData({ profile, navItems, visuals, projects, books, leetcode });
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (key) => {
    if (key === "profile") {
      const profile = await api.getProfile();
      setData((d) => ({ ...d, profile }));
      return;
    }
    if (key === "navItems") {
      const navItems = await api.getNav();
      setData((d) => ({ ...d, navItems }));
      return;
    }
    const items = await api.getCollection(key);
    setData((d) => ({ ...d, [key]: items }));
  }, []);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return (
    <DataContext.Provider value={{ ...data, loading, error, refetchAll, refetch }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
