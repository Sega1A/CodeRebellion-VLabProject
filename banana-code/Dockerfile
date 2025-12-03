FROM node:20-alpine AS builder
WORKDIR /app
COPY banana-code/package.json banana-code/package-lock.json ./ 
COPY banana-code/prisma/schema.prisma ./prisma/

RUN npm install
COPY banana-code/. .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production 

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY banana-code/public ./public 
COPY --from=builder /app/prisma ./prisma 
ENV PORT 8080
EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]