# Production Deployment Guide

## Containerization & Docker Deployment

This guide helps you deploy the Admissions CRM application using Docker for production.

## Prerequisites

- Docker and Docker Compose installed
- Server with at least 2GB RAM
- Port 3000 and 5432 accessible (or configure nginx reverse proxy)
- `.env` file with production credentials

## Files Created

1. **Dockerfile** - Multi-stage build for production
2. **docker-compose.prod.yml** - Production Docker Compose configuration
3. **DEPLOYMENT.md** - This deployment guide

## Quick Start - Local Docker Testing

### 1. Build the Docker image locally

```bash
docker build -t admissions-crm:latest .
```

### 2. Create `.env.prod` file with your production variables

```bash
cp .env .env.prod
```

Edit `.env.prod` with your production values:
```env
NEXTAUTH_URL="https://snvs.dpdns.org"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
AUTOSEND_API_KEY="your-actual-api-key"
```

### 3. Run with Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Initialize the database

```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed
```

### 5. Access the application

- App URL: http://localhost:3000 (or your domain)
- Database: localhost:5432

## Production Deployment Steps

### 1. Prepare Your Server

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (optional, requires logout/login)
sudo usermod -aG docker $USER
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/your-repo/admissions-crm.git
cd admissions-crm
sudo chown -R $USER:$USER .
```

### 3. Set Up Environment Variables

```bash
# Copy and edit production env file
cp .env .env.production
nano .env.production
```

Update with your production values:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@postgres:5432/admissions_crm"
NEXTAUTH_URL="https://snvs.dpdns.org"
NEXTAUTH_SECRET="GENERATE_NEW_SECRET_HERE"
JWT_SECRET="GENERATE_NEW_SECRET_HERE"
AUTOSEND_API_KEY="your-api-key"
AUTOSEND_SENDER_EMAIL="noreply@snvs.dpdns.org"
ADMIN_NOTIFICATION_EMAIL="admin@snvs.dpdns.org"
NODE_ENV="production"
```

### 4. Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### 5. Build and Deploy

```bash
# Build the image
docker build -t admissions-crm:latest .

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 6. Initialize Database

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Seed database (if seed file exists)
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed

# Create admin user
docker-compose -f docker-compose.prod.yml exec app npm run seed
```

## Nginx Reverse Proxy Configuration (Optional)

If you want to use Nginx as a reverse proxy on port 80/443:

### 1. Install Nginx

```bash
sudo apt-get install nginx
```

### 2. Create Nginx config

```bash
sudo nano /etc/nginx/sites-available/admissions-crm
```

```nginx
server {
    listen 80;
    server_name snvs.dpdns.org;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name snvs.dpdns.org;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable Nginx config

```bash
sudo ln -s /etc/nginx/sites-available/admissions-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Docker Commands Reference

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# View database logs
docker-compose -f docker-compose.prod.yml logs -f postgres

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Access app shell
docker-compose -f docker-compose.prod.yml exec app sh

# Access database
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d admissions_crm

# Clean up (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v
```

## Monitoring & Maintenance

### View Application Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Check Application Logs

```bash
docker-compose -f docker-compose.prod.yml logs --tail=100 -f app
```

### Database Backup

```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres admissions_crm > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Database Restore

```bash
cat backup_20231114_150000.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d admissions_crm
```

## Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Rebuild image
docker-compose -f docker-compose.prod.yml build --no-cache

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### Database connection failed

```bash
# Check database status
docker-compose -f docker-compose.prod.yml ps postgres

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Restart database
docker-compose -f docker-compose.prod.yml restart postgres
```

### Port already in use

```bash
# Change port in docker-compose.prod.yml or:
sudo lsof -i :3000
sudo kill -9 <PID>
```

## Security Best Practices

1. **Never commit secrets to Git** - Use `.env` files
2. **Use HTTPS in production** - Configure SSL/TLS certificates
3. **Keep images updated** - Regularly rebuild with latest dependencies
4. **Use strong passwords** - For database and secrets
5. **Enable backups** - Regular database backups
6. **Monitor logs** - Check logs regularly for errors
7. **Update regularly** - Keep Node.js, PostgreSQL, and dependencies updated

## Support & Documentation

- Next.js: https://nextjs.org/docs
- Docker: https://docs.docker.com
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs
