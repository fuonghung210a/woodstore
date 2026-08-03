FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@10.19.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/product/package.json apps/product/package.json
COPY packages/database/package.json packages/database/package.json
RUN pnpm install --frozen-lockfile

COPY apps/product apps/product
COPY packages packages
RUN pnpm --filter @woodshop/product prisma:generate \
  && pnpm --filter @woodshop/database build \
  && pnpm --filter @woodshop/product build

FROM node:20-alpine AS runtime
WORKDIR /app/apps/product
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 product

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/product/node_modules ./node_modules
COPY --from=build /app/apps/product/dist ./dist
COPY --from=build /app/apps/product/package.json ./package.json
COPY --from=build /app/apps/product/prisma ./prisma
COPY --from=build /app/packages/database /app/packages/database

USER product
EXPOSE 3001
CMD ["node", "dist/main"]
