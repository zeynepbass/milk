FROM node:22-alpine AS base
WORKDIR /app
ENV MONGOMS_DISABLE_POSTINSTALL=1

FROM base AS dev
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5346
CMD ["npm", "run", "dev"]

FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json migrate-mongo-config.js ./
COPY src ./src
COPY migrations ./migrations
COPY scripts ./scripts
RUN mkdir -p /app/uploads /app/private-uploads && chown -R node:node /app/uploads /app/private-uploads
USER node
EXPOSE 5346
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5346/health || exit 1
CMD ["node", "src/server.js"]
