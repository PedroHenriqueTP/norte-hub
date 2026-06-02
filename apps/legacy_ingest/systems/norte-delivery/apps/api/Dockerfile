
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instala dependências e faz o build
RUN npm install
RUN npm run build

# Stage 2: Production Run
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
