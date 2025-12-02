FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./ 
COPY prisma/schema.prisma ./prisma/

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

EXPOSE 8080
CMD ["node", "server.js"]