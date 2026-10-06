FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY apps/admin-web ./apps/admin-web

RUN pnpm install
RUN pnpm --filter @shms/shared run build
RUN pnpm --filter @shms/admin-web run build

EXPOSE 3000
CMD ["pnpm", "--filter", "@shms/admin-web", "run", "start"]
