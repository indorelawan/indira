FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json .

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --production

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE ${PORT}

RUN npm install -g pm2

CMD ["pm2-runtime", "dist/index.js"]
