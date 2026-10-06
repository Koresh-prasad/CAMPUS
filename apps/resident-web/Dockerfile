FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY apps/resident-web ./apps/resident-web

RUN pnpm install
RUN pnpm --filter @shms/shared run build
RUN pnpm --filter @shms/resident-web run build

EXPOSE 3001
CMD ["pnpm", "--filter", "@shms/resident-web", "run", "start"]
