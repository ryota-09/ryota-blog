FROM node:18-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Install necessary packages for node-gyp and sharp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Set the environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG MICROCMS_SERVICE_DOMAIN
ARG MICROCMS_API_KEY
ARG NEXT_PUBLIC_GUEST_ROLE_ARN
ARG NEXT_PUBLIC_IDENTITY_POOL_ID
ARG NEXT_PUBLIC_APPLICATION_ID
RUN touch .env
RUN echo "NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}" >> .env
RUN echo "MICROCMS_SERVICE_DOMAIN=${MICROCMS_SERVICE_DOMAIN}" >> .env
RUN echo "MICROCMS_API_KEY=${MICROCMS_API_KEY}" >> .env
RUN echo "NEXT_PUBLIC_GUEST_ROLE_ARN=${NEXT_PUBLIC_GUEST_ROLE_ARN}" >> .env
RUN echo "NEXT_PUBLIC_IDENTITY_POOL_ID=${NEXT_PUBLIC_IDENTITY_POOL_ID}" >> .env
RUN echo "NEXT_PUBLIC_APPLICATION_ID=${NEXT_PUBLIC_APPLICATION_ID}" >> .env
RUN cat .env

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]