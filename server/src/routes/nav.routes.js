import { Router } from "express";
import { getData, updateData } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const data = await getData();
  res.json(data.navItems);
});

router.post("/", requireAdmin, async (req, res) => {
  const { label } = req.body || {};
  if (!label || !label.trim()) return res.status(400).json({ error: "label is required" });

  const base =
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `section-${Date.now()}`;

  const data = await updateData((d) => {
    let id = base;
    let n = 1;
    while (d.navItems.some((i) => i.id === id)) id = `${base}-${n++}`;
    const maxOrder = d.navItems.reduce((m, i) => Math.max(m, i.order), -1);
    d.navItems.push({ id, label: label.trim(), order: maxOrder + 1 });
  });
  res.status(201).json(data.navItems);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { label, order } = req.body || {};
  const data = await updateData((d) => {
    const item = d.navItems.find((i) => i.id === id);
    if (!item) return;
    if (label !== undefined) item.label = label;
    if (order !== undefined) item.order = order;
  });
  res.json(data.navItems);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const data = await updateData((d) => {
    d.navItems = d.navItems.filter((i) => i.id !== id);
  });
  res.json(data.navItems);
});

export default router;
