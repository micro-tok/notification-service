# Stage 1: Build
FROM node:20 AS builder
WORKDIR /usr/src/app
ENV PNPM_STORE_DIR=/usr/src/app/.pnpm-store
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Stage 2: Run
FROM node:20-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 50005
CMD ["node", "dist/main"]
