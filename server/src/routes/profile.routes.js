import { Router } from "express";
import { getData, updateData } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload, publicUrlFor } from "../utils/upload.js";

const router = Router();

router.get("/", async (req, res) => {
  const data = await getData();
  res.json(data.profile);
});

router.put("/", requireAdmin, async (req, res) => {
  const { name, title, bio, chips } = req.body || {};
  const data = await updateData((d) => {
    if (name !== undefined) d.profile.name = name;
    if (title !== undefined) d.profile.title = title;
    if (bio !== undefined) d.profile.bio = bio;
    if (Array.isArray(chips)) d.profile.chips = chips;
  });
  res.json(data.profile);
});

router.post("/photo", requireAdmin, upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = publicUrlFor(req.file.filename);
  const data = await updateData((d) => {
    d.profile.photoUrl = url;
  });
  res.json(data.profile);
});

export default router;
