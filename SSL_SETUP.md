# SSL/TLS Certificate Setup for Production

## Using Let's Encrypt with Certbot

### 1. Install Certbot on your server

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. Create SSL directory for Docker

```bash
mkdir -p ~/admissions-crm/ssl
```

### 3. Generate Certificate (using Standalone mode first)

```bash
# Stop nginx temporarily
docker-compose -f docker-compose.prod.yml stop nginx

# Generate certificate
sudo certbot certonly --standalone \
  -d snvs.dpdns.org \
  -m your-email@example.com \
  --agree-tos

# This creates certificates at: /etc/letsencrypt/live/snvs.dpdns.org/
```

### 4. Copy certificates to Docker volume

```bash
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/fullchain.pem ~/admissions-crm/ssl/cert.pem
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/privkey.pem ~/admissions-crm/ssl/key.pem
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/chain.pem ~/admissions-crm/ssl/chain.pem

# Set proper permissions
sudo chown -R $USER:$USER ~/admissions-crm/ssl
chmod 600 ~/admissions-crm/ssl/*.pem
```

### 5. Uncomment SSL in nginx.conf

Edit `nginx.conf` and uncomment these lines:

```nginx
# SSL certificates (uncomment when you have SSL)
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
```

### 6. Start services with SSL

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 7. Auto-renewal setup

```bash
# Create renewal script
sudo tee /usr/local/bin/certbot-renewal.sh > /dev/null <<'EOF'
#!/bin/bash
cd /home/your-user/admissions-crm

# Stop nginx
docker-compose -f docker-compose.prod.yml stop nginx

# Renew certificate
sudo certbot renew --quiet

# Copy new certificates
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/fullchain.pem ~/admissions-crm/ssl/cert.pem
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/privkey.pem ~/admissions-crm/ssl/key.pem
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/chain.pem ~/admissions-crm/ssl/chain.pem

# Fix permissions
sudo chown -R $USER:$USER ~/admissions-crm/ssl
chmod 600 ~/admissions-crm/ssl/*.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml start nginx
EOF

sudo chmod +x /usr/local/bin/certbot-renewal.sh
```

### 8. Add to crontab for auto-renewal

```bash
# Edit crontab
sudo crontab -e

# Add this line (renews at 2 AM daily)
0 2 * * * /usr/local/bin/certbot-renewal.sh >> /var/log/certbot-renewal.log 2>&1
```

## Testing SSL/TLS

```bash
# Test certificate validity
openssl x509 -in ~/admissions-crm/ssl/cert.pem -text -noout

# Test SSL configuration
curl -I https://snvs.dpdns.org

# Test with detailed SSL info
openssl s_client -connect snvs.dpdns.org:443 -tls1_2
```

## Updating NEXTAUTH_URL for HTTPS

Update your `.env` file:

```env
NEXTAUTH_URL="https://snvs.dpdns.org"
```

Then restart:

```bash
docker-compose -f docker-compose.prod.yml restart app
```

## SSL/TLS Best Practices

1. ✅ Use HTTPS (TLS 1.2 or higher)
2. ✅ Enable HSTS (HTTP Strict Transport Security)
3. ✅ Renew certificates automatically
4. ✅ Use strong ciphers
5. ✅ Keep private keys secure
6. ✅ Monitor certificate expiration

## Troubleshooting

### Certificate not found

```bash
# Check if files exist
ls -la ~/admissions-crm/ssl/

# Regenerate if missing
sudo certbot certonly --standalone -d snvs.dpdns.org
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/*.pem ~/admissions-crm/ssl/
```

### Nginx SSL errors

```bash
# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Test nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Certificate expired

```bash
# Manually renew
sudo certbot renew --force-renewal

# Copy new certificates
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/fullchain.pem ~/admissions-crm/ssl/cert.pem
sudo cp /etc/letsencrypt/live/snvs.dpdns.org/privkey.pem ~/admissions-crm/ssl/key.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## References

- Let's Encrypt: https://letsencrypt.org/
- Certbot: https://certbot.eff.org/
- Nginx SSL: https://nginx.org/en/docs/http/ngx_http_ssl_module.html
- SSL Configuration: https://ssl-config.mozilla.org/
