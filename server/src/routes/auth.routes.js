import { Router } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== config.adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ role: "admin" }, config.jwtSecret, { expiresIn: "30d" });
  res.json({ token });
});

export default router;
