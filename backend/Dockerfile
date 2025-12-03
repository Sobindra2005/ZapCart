# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

RUN npx prisma generate

# Copy source code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start with hot reload
CMD ["npm", "run", "dev"]

# Dockerfile (production)
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install all dependencies (including dev for building)
# RUN npm ci

# # Copy source code
# COPY . .

# # Build TypeScript
# RUN npm run build

# # Production image
# FROM node:20-alpine

# WORKDIR /app

# # Copy package.json and only production dependencies
# COPY package*.json ./
# RUN npm ci --only=production

# # Copy compiled JS from builder
# COPY --from=builder /app/dist ./dist

# # Create non-root user
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nodejs -u 1001
# RUN chown -R nodejs:nodejs /app
# USER nodejs

# EXPOSE 8080

# # Start compiled app
# CMD ["node", "dist/server.js"]
