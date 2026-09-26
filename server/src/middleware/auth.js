import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role !== "admin") throw new Error("wrong role");
    req.isAdmin = true;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
