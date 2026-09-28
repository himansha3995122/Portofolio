// A generic REST router for a simple, ordered list collection
// (visuals / projects / books / leetcode all share this exact shape:
// read-only for everyone, add/reorder/remove for the admin only).

import { Router } from "express";
import { getData, updateData } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload, publicUrlFor } from "../utils/upload.js";

function splitTags(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
}

export function createCollectionRouter(key, { withImage = false } = {}) {
  const router = Router();

  router.get("/", async (req, res) => {
    const data = await getData();
    res.json(data[key]);
  });

  const uploadMiddleware = withImage ? [upload.single("image")] : [];

  router.post("/", requireAdmin, ...uploadMiddleware, async (req, res) => {
    const body = { ...req.body };
    const tags = splitTags(body.tags);
    if (tags !== undefined) body.tags = tags;

    if (withImage && req.file) body.imageUrl = publicUrlFor(req.file.filename);

    const id = `${key.slice(0, 3)}${Date.now()}`;
    const data = await updateData((d) => {
      const maxOrder = d[key].reduce((m, i) => Math.max(m, i.order), -1);
      d[key].push({ id, order: maxOrder + 1, ...body });
    });
    res.status(201).json(data[key]);
  });

  router.patch("/:id", requireAdmin, ...uploadMiddleware, async (req, res) => {
    const { id } = req.params;
    const body = { ...req.body };
    const tags = splitTags(body.tags);
    if (tags !== undefined) body.tags = tags;

    if (withImage && req.file) body.imageUrl = publicUrlFor(req.file.filename);

    const data = await updateData((d) => {
      const item = d[key].find((i) => i.id === id);
      if (item) Object.assign(item, body);
    });
    res.json(data[key]);
  });

  router.delete("/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const data = await updateData((d) => {
      d[key] = d[key].filter((i) => i.id !== id);
    });
    res.json(data[key]);
  });

  return router;
}
