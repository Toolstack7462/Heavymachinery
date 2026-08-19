# syntax=docker/dockerfile:1

# =============================================================================
#  Production image — multi-stage, standalone output, non-root runtime.
#  Final image carries the Next server and its traced dependencies only:
#  no npm, no devDependencies, no source.
# =============================================================================

# --- deps: install with the lockfile, nothing else -------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


# --- build -----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Baked into the prerendered HTML, so it must be correct at BUILD time, not
# only at run time. Override with --build-arg SITE_URL=https://your-domain.
ARG SITE_URL=https://jowainyanbu.com
ENV SITE_URL=$SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build


# --- runtime ---------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as an unprivileged user rather than root.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: "standalone"` emits a minimal server plus only the modules it
# traced. static/ and public/ are not included in that trace and are copied
# separately, which is expected.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/en').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
