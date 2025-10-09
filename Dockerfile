# Install dependencies only when needed
FROM node:lts-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
# This is where because may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
FROM node:lts-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm in builder stage
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner

ARG X_TAG
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

CMD ["node_modules/.bin/next", "start"]