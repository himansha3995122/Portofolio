// A tiny JSON-file-backed store. This is intentionally simple — plenty
// for one person's portfolio content. If you outgrow it (heavy traffic,
// multiple editors at once), swap this module for a real database
// (Postgres, SQLite, MongoDB, ...) without touching the routes, since
// they only call getData() / updateData() below.

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const DEFAULT_DATA = {
  profile: {
    name: "Himansha",
    title: "Software Engineer",
    bio: "I build things with code, chase clean solutions on LeetCode, take photos on the side, and always have a book going. This site is a running log of all of it.",
    chips: ["Software Engineer", "Sydney"],
    photoUrl: "",
  },
  navItems: [
    { id: "swe", label: "Software Engineering", order: 0 },
    { id: "visuals", label: "Visuals", order: 1 },
    { id: "books", label: "Books", order: 2 },
    { id: "leetcode", label: "LeetCode", order: 3 },
  ],
  visuals: [],
  projects: [],
  books: [],
  leetcode: [],
};

let cache = null;
let writing = Promise.resolve();

async function load() {
  if (cache) return cache;
  try {
    const raw = await readFile(DB_PATH, "utf-8");
    cache = JSON.parse(raw);
  } catch {
    cache = structuredClone(DEFAULT_DATA);
    // The data dir may not exist yet (e.g. a fresh Docker volume).
    await mkdir(path.dirname(DB_PATH), { recursive: true });
    await persist();
  }
  return cache;
}

async function persist() {
  // Chain writes so concurrent admin edits can't interleave and corrupt the file.
  writing = writing.then(() => writeFile(DB_PATH, JSON.stringify(cache, null, 2), "utf-8"));
  return writing;
}

export async function getData() {
  return load();
}

export async function updateData(mutate) {
  const data = await load();
  mutate(data);
  await persist();
  return data;
}
