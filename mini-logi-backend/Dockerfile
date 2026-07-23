FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@11.13.1 --activate

WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

FROM dependencies AS development

ENV NODE_ENV=development

COPY . .

RUN pnpm prisma:generate

EXPOSE 3333

CMD ["pnpm", "dev"]

FROM dependencies AS build

COPY . .

RUN pnpm prisma:generate \
    && pnpm build \
    && pnpm prune --prod

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3333

CMD ["sh", "-c", "pnpm prisma:migrate:deploy && node dist/main.js"]
