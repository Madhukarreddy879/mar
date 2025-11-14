#!/bin/bash

# Admissions CRM - Production Deployment Script
# This script automates the deployment process

set -e

echo "================================"
echo "Admissions CRM - Production Deploy"
echo "================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Docker is installed
print_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Compose is installed
print_info "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed"

# Check if .env file exists
print_info "Checking environment file..."
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Creating .env file from template..."
    cp .env.example .env
    print_info "Please edit .env with your production values"
    exit 1
fi
print_success ".env file found"

# Build Docker image
print_info "Building Docker image..."
if docker build -t admissions-crm:latest .; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Start services
print_info "Starting Docker services..."
if docker-compose -f docker-compose.prod.yml up -d; then
    print_success "Docker services started"
else
    print_error "Failed to start Docker services"
    exit 1
fi

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check service status
print_info "Checking service status..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "healthy"; then
    print_success "Services are healthy"
else
    print_info "Services are starting up..."
fi

# Run database migrations
print_info "Running database migrations..."
if docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
fi

# Seed database (optional)
print_info "Do you want to seed the database? (y/n)"
read -r seed_response
if [ "$seed_response" = "y" ]; then
    if docker-compose -f docker-compose.prod.yml exec -T app npm run seed; then
        print_success "Database seeded successfully"
    else
        print_info "Database seeding skipped or not available"
    fi
fi

# Display summary
echo ""
echo "================================"
print_success "Deployment completed!"
echo "================================"
echo ""
echo "Application Details:"
echo "  - URL: http://snvs.dpdns.org (update NEXTAUTH_URL if different)"
echo "  - Database: PostgreSQL"
echo "  - Status: Check with 'docker-compose -f docker-compose.prod.yml ps'"
echo ""
echo "Useful Commands:"
echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f app"
echo "  - Access shell: docker-compose -f docker-compose.prod.yml exec app sh"
echo "  - Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  - Restart services: docker-compose -f docker-compose.prod.yml restart"
echo ""
print_info "Full documentation available in DEPLOYMENT.md"
