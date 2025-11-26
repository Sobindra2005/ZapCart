# Docker Deployment Guide

Complete guide for deploying the E-Commerce backend with Docker and Nginx.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [SSL/HTTPS Setup](#sslhttps-setup)

## 🔧 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- For VPS: Ubuntu 20.04+ or similar Linux distribution

### Installing Docker on Ubuntu VPS

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

## 📁 Project Structure

```
Ecommerce/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .dockerignore
└── DEPLOYMENT.md
```

## 💻 Local Development

### 1. Setup Environment Variables

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` and set your variables:

```env
DATABASE_URL=mongodb://your-mongodb-host:27017/ecommerce
```

### 2. Build and Run

Build and start all services:

```bash
docker compose up --build
```

Or run in detached mode:

```bash
docker compose up -d --build
```

### 3. Verify Services

- **Backend API**: http://localhost/api/v1/examples
- **Health Check**: http://localhost/health
- **Root**: http://localhost (shows API documentation page)

### 4. View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f nginx
```

### 5. Stop Services

```bash
# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

## 🚀 Production Deployment

### Step 1: Prepare VPS

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Create project directory
mkdir -p ~/ecommerce
cd ~/ecommerce
```

### Step 2: Transfer Files

From your local machine:

```bash
# Using rsync
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  ./ user@your-vps-ip:~/ecommerce/

# Or using scp
scp -r backend nginx docker-compose.yml .env user@your-vps-ip:~/ecommerce/
```

Or clone from Git repository (recommended):

```bash
git clone your-repository-url ~/ecommerce
cd ~/ecommerce
```

### Step 3: Configure Environment

```bash
# Create .env file
nano .env
```

Set production values:

```env
DATABASE_URL=mongodb://your-production-mongodb-host:27017/ecommerce
```

### Step 4: Build and Deploy

```bash
# Build images
docker compose build

# Start services in detached mode
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Step 5: Verify Deployment

```bash
# Check if services are running
curl http://localhost/health

# Check API endpoint
curl http://localhost/api/v1/examples
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |

### Optional Variables

Add these to `.env` as needed:

```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# API Keys
API_KEY=your-api-key-here

# Other configs
LOG_LEVEL=info
```

Environment variables are automatically passed to the backend container via `docker-compose.yml`.

## 📦 Docker Commands

### Building

```bash
# Build all services
docker compose build

# Build specific service
docker compose build backend
docker compose build nginx

# Build without cache
docker compose build --no-cache
```

### Running

```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Start specific service
docker compose up backend
```

### Stopping

```bash
# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Stop, remove containers and volumes
docker compose down -v

# Stop, remove everything including images
docker compose down --rmi all
```

### Monitoring

```bash
# View running containers
docker compose ps

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# View specific service logs
docker compose logs backend

# View resource usage
docker stats
```

### Maintenance

```bash
# Restart services
docker compose restart

# Restart specific service
docker compose restart backend

# Execute command in container
docker compose exec backend sh

# View backend container shell
docker compose exec backend /bin/sh
```

### Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

## 🔍 Troubleshooting

### Issue: Port 80 already in use

```bash
# Check what's using port 80
sudo lsof -i :80

# Stop the service using port 80
sudo systemctl stop apache2  # or nginx, etc.

# Or change Nginx port in docker-compose.yml
ports:
  - "8080:80"  # Access via http://localhost:8080
```

### Issue: Backend container keeps restarting

```bash
# Check logs
docker compose logs backend

# Common issues:
# 1. Missing environment variables - check .env file
# 2. Database connection failed - verify DATABASE_URL
# 3. Port conflict - check if 8080 is available
```

### Issue: Cannot connect to backend from Nginx

```bash
# Verify backend is running
docker compose ps

# Check backend health
docker compose exec backend wget -O- http://localhost:8080/health

# Verify network connectivity
docker compose exec nginx ping backend
```

### Issue: Permission denied errors

```bash
# If you get permission denied, add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker run hello-world
```

### Rebuild after code changes

```bash
# Stop services
docker compose down

# Rebuild and start
docker compose up --build -d
```

## 🔒 SSL/HTTPS Setup

For production, you should use HTTPS. Here's how to add SSL using Let's Encrypt:

### Option 1: Using Certbot (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Stop Nginx container
docker compose stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be saved in /etc/letsencrypt/live/yourdomain.com/
```

Update `docker-compose.yml`:

```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
  ports:
    - "80:80"
    - "443:443"
```

Update `nginx/nginx.conf` to add HTTPS server block:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of configuration
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Option 2: Using Nginx Proxy Manager

For easier SSL management, consider using Nginx Proxy Manager:

```yaml
# Add to docker-compose.yml
  nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'  # Admin interface
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

Access admin interface at `http://your-vps-ip:81`

## 📊 Health Checks

Both services have built-in health checks:

```bash
# Check backend health
curl http://localhost/health

# View health status in Docker
docker compose ps
```

## 🔄 Updating Your Application

```bash
# Pull latest code (if using Git)
git pull

# Rebuild and restart
docker compose up --build -d

# Or with zero downtime (requires multiple instances)
docker compose up --build --no-deps -d backend
```

## 📈 Monitoring (Production)

Consider adding monitoring tools:

```bash
# Docker stats
docker stats

# Container logs
docker compose logs --tail=100 -f

# System resources
htop
```

For production monitoring, consider:
- **Prometheus + Grafana**: Metrics and dashboards
- **ELK Stack**: Centralized logging
- **Uptime monitoring**: UptimeRobot, Pingdom

## 🎯 Performance Tips

1. **Use production NODE_ENV**: Already set in docker-compose.yml
2. **Enable caching**: Nginx already configured with gzip
3. **Database indexing**: Add indexes to frequently queried fields
4. **Container resources**: Limit CPU/memory if needed

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
```

## 🔐 Security Best Practices

1. ✅ **Non-root user**: Backend runs as non-root (already configured)
2. ✅ **Security headers**: Nginx adds security headers (already configured)
3. ✅ **Rate limiting**: Nginx rate limiting configured
4. ⚠️ **Firewall**: Configure UFW on VPS
5. ⚠️ **SSH keys**: Use SSH keys instead of passwords
6. ⚠️ **Environment secrets**: Never commit .env to Git
7. ⚠️ **Regular updates**: Keep Docker images updated

## 📝 Next Steps

1. Add frontend container when ready
2. Configure database (MongoDB) in separate container
3. Set up CI/CD pipeline
4. Add Redis for caching
5. Implement log aggregation

## 📞 Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Verify environment variables
- Check Docker documentation: https://docs.docker.com
