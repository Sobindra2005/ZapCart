# Quick Start Guide - Docker Setup

## 🚀 Start Your Application

### 1. Start Docker Desktop
Make sure Docker Desktop is running before executing any commands.

### 2. Build Images
```bash
cd "d:\Personal Projects\Ecommerce"
docker compose build
```

### 3. Start Services
```bash
docker compose up --watch
```
> **Note:** The `--watch` flag is required for hot reloading to work. It enables the file sync between your host and the container.


### 4. Check Status
```bash
docker compose ps
```

All services should show "healthy" status.

### 5. Access Your Application

- **Frontend (Next.js):** http://localhost/
- **API (via Nginx):** http://localhost/api/health
- **Backend (direct):** http://localhost:8080/health

## 📊 Useful Commands

```bash
# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f client
docker compose logs -f nginx
docker compose logs -f backend

# Restart a service
docker compose restart client

# Stop all services
docker compose down

# Rebuild and restart
# Rebuild and restart
docker compose up --watch --build

```

## 🔧 Troubleshooting

**Docker daemon not running:**
```
Error: cannot find the file specified
Solution: Start Docker Desktop
```

**Port already in use:**
```bash
# Check what's using port 80
netstat -ano | findstr :80

# Kill the process or change the port in docker-compose.yml
```

**Service unhealthy:**
```bash
# Check logs for the unhealthy service
docker compose logs [service-name]

# Increase start_period in docker-compose.yml if needed
```

## 📁 Project Structure

```
Ecommerce/
├── backend/
│   ├── Dockerfile
│   └── src/
├── client/
│   ├── Dockerfile          ← NEW
│   ├── .dockerignore       ← NEW
│   ├── next.config.ts      ← MODIFIED
│   └── app/
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf          ← MODIFIED
└── docker-compose.yml      ← MODIFIED
```

## 🌐 Routing

| URL | Destination | Purpose |
|-----|-------------|---------|
| `http://localhost/` | Next.js Client | Frontend pages |
| `http://localhost/api/*` | Express Backend | API endpoints |
| `http://localhost/_next/*` | Next.js Client | Static assets |

## ✅ Verification Checklist

- [ ] Docker Desktop is running
- [ ] All images built successfully
- [ ] All services are healthy
- [ ] Frontend loads at http://localhost/
- [ ] API responds at http://localhost/api/health
- [ ] No errors in browser console
