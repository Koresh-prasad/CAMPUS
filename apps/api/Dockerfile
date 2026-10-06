FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN pnpm install
RUN pnpm --filter @shms/shared run build
RUN cd apps/api && pnpm prisma generate && pnpm prisma db push

EXPOSE 4000
CMD ["pnpm", "--filter", "@shms/api", "run", "start"]
