FROM node:20-alpine

WORKDIR /app

# Copy root package files and workspace configuration
COPY package*.json ./
COPY turbo.json ./
COPY .npmrc ./

# Copy workspace package.json files first for better layer caching
COPY apps/client/package*.json ./apps/client/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# Install all workspace dependencies
RUN npm ci --workspaces --include-workspace-root

# Copy workspace packages and apps (will be synced by volume mounts)
COPY apps ./apps
COPY packages ./packages

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use Turborepo to run dev command
CMD ["npm", "run", "dev"]