import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

function readEnv(name, fallback, { warnIfDefault = false } = {}) {
  const value = process.env[name] ?? fallback;
  if (value === fallback && warnIfDefault) {
    // Refuse to boot a production server with a guessable secret/password.
    if (isProduction) {
      throw new Error(`[config] ${name} must be set when NODE_ENV=production.`);
    }
    // eslint-disable-next-line no-console
    console.warn(
      `[config] ${name} is not set in .env — using an insecure default. ` +
        `CHANGE ME before deploying (see server/.env.example).`
    );
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: readEnv("JWT_SECRET", "dev-only-secret-change-me", { warnIfDefault: true }),
  adminPassword: readEnv("ADMIN_PASSWORD", "changeme", { warnIfDefault: true }),
  // CHANGE ME: only relevant in local dev (client on a different port).
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
