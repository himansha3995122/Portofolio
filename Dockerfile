# syntax=docker/dockerfile:1

# ---------- 1. Build the React client ----------
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
# Optional: only if the API lives on a different domain (see client/.env.example).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- 2. Install server production deps ----------
FROM node:22-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# ---------- 3. Runtime image ----------
FROM node:22-alpine
ENV NODE_ENV=production \
    PORT=4000
WORKDIR /app/server

# Layout mirrors the repo so server/src/index.js finds ../../client/dist.
COPY --from=server-deps --chown=node:node /app/server/node_modules ./node_modules
COPY --chown=node:node server/package.json ./
COPY --chown=node:node server/src ./src
COPY --chown=node:node server/data ./data
COPY --from=client-build --chown=node:node /app/client/dist /app/client/dist
RUN mkdir -p uploads && chown node:node uploads

USER node

# Admin edits and uploaded images live here — mount volumes so they
# survive container rebuilds/redeploys.
VOLUME ["/app/server/data", "/app/server/uploads"]

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" || exit 1

CMD ["node", "src/index.js"]
