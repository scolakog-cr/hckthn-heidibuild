#!/bin/bash

echo "🏥 Clinical Interface Setup"
echo "=========================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

if [ $? -ne 0 ]; then
  echo "❌ Failed to start PostgreSQL"
  exit 1
fi

echo "✅ PostgreSQL started"
echo ""

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# Install dependencies
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "⚠️  Prisma generate failed. Trying with checksum ignore..."
  PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

  if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    echo "You may need to run this manually with network access"
    exit 1
  fi
fi

echo "✅ Prisma Client generated"
echo ""

# Push database schema
echo "🗄️  Pushing database schema..."
npx prisma db push

if [ $? -ne 0 ]; then
  echo "❌ Failed to push database schema"
  exit 1
fi

echo "✅ Database schema pushed"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

if [ $? -ne 0 ]; then
  echo "❌ Failed to seed database"
  exit 1
fi

echo "✅ Database seeded with sample data"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
