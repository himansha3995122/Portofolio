import express from "express";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

import { config } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import navRoutes from "./routes/nav.routes.js";
import { createCollectionRouter } from "./routes/collection.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Behind a reverse proxy / load balancer (Render, Fly, nginx, ...) this
// makes req.ip and req.protocol reflect the real client.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Send plain-HTTP visitors to HTTPS in production so the admin password is
// never posted unencrypted. Only acts when the proxy in front (cPanel's
// LiteSpeed, Caddy, ...) explicitly reports "http" — if that header isn't
// sent, this does nothing rather than risk a redirect loop.
app.use((req, res, next) => {
  const proto = (req.get("x-forwarded-proto") || "").split(",")[0].trim();
  if (process.env.NODE_ENV === "production" && proto === "http") {
    return res.redirect(301, `https://${req.get("host")}${req.originalUrl}`);
  }
  if (proto === "https") {
    res.set("Strict-Transport-Security", "max-age=31536000");
  }
  next();
});

// CHANGE ME: in local dev this allows the Vite dev server (a different
// port) to call this API. In production, Express serves the built
// client itself (see below) so requests are same-origin and CORS
// doesn't come into play — you can leave this as-is.
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Used by the Docker HEALTHCHECK and by hosts that probe for liveness.
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/nav", navRoutes);
app.use("/api/visuals", createCollectionRouter("visuals", { withImage: true }));
app.use("/api/projects", createCollectionRouter("projects"));
app.use("/api/books", createCollectionRouter("books"));
app.use("/api/leetcode", createCollectionRouter("leetcode"));

// ============================================================
// CHANGE ME (nothing to actually change, just know this exists):
// once you run `npm run build` in /client, this serves the built
// React app from the same Node process/port as the API — so your
// whole site (frontend + backend) is one deployable thing on one
// domain. Point your domain's DNS at wherever this process runs.
// ============================================================
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const server = app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

// `docker stop` and most hosts send SIGTERM on redeploy — finish in-flight
// requests before exiting instead of being killed mid-write.
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
