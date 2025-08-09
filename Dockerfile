# ---------- Builder ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Tools for native modules (argon2, better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++       && rm -rf /var/lib/apt/lists/*

# Backend deps
COPY backend/package.json backend/tsconfig.json ./backend/
RUN cd backend && npm install

# Frontend deps
COPY frontend/package.json frontend/tsconfig.json frontend/vite.config.ts frontend/postcss.config.cjs frontend/tailwind.config.ts ./frontend/
RUN cd frontend && npm install

# Copy sources
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# Build backend and include frontend
RUN mkdir -p backend/dist/public && cp -r frontend/dist/* backend/dist/public/ || true
RUN cd backend && npm run build

# ---------- Runtime ----------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=5177

RUN useradd -m -u 10001 appuser

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY .env.example ./.env.example

RUN mkdir -p /app/data && chown -R appuser:appuser /app
VOLUME ["/app/data"]
EXPOSE 5177
USER appuser
CMD ["node", "backend/dist/server.js"]
