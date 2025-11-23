# Setup Guide

## Complete Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start PostgreSQL

**Option 1: Using Docker (Recommended)**
```bash
docker-compose up -d
```

This will start a PostgreSQL instance on port 5432 with:
- Username: `postgres`
- Password: `postgres`
- Database: `clinical_interface`

**Option 2: Use existing PostgreSQL**

If you have PostgreSQL installed locally, update the `.env` file with your connection string:
```
DATABASE_URL="postgresql://username:password@localhost:5432/clinical_interface?schema=public"
```

### Step 3: Set up Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

If you encounter network issues with Prisma, try:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Step 4: Seed the Database

```bash
npm run db:seed
```

This will create:
- 8 sample patients with complete demographics
- 1-3 consultations per patient
- Sample clinical notes and vitals

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Prisma Generate Fails

If `npx prisma generate` fails due to network restrictions:

1. Try with the environment variable:
   ```bash
   PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
   ```

2. If still failing, you may need to manually download Prisma engines or use a network with fewer restrictions.

### Database Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   docker ps
   ```
   You should see a container named `clinical_interface_db`

2. **Check connection:**
   ```bash
   npx prisma db pull
   ```

3. **Reset database if needed:**
   ```bash
   docker-compose down -v
   docker-compose up -d
   npx prisma db push
   npm run db:seed
   ```

### Port Already in Use

If port 3000 is already in use:
```bash
PORT=3001 npm run dev
```

If port 5432 (PostgreSQL) is already in use, either:
- Stop the existing PostgreSQL instance
- Or change the port in `docker-compose.yml` and update `.env`

### Fresh Start

To completely reset everything:

```bash
# Stop and remove database
docker-compose down -v

# Start fresh database
docker-compose up -d

# Reset Prisma
npx prisma db push --force-reset

# Seed database
npm run db:seed

# Start dev server
npm run dev
```

## Verify Setup

After setup, you should be able to:

1. ✅ Navigate to http://localhost:3000
2. ✅ See the patients list page with 8 sample patients
3. ✅ Click on a patient to view their details
4. ✅ See consultations in the patient's timeline
5. ✅ Click on a consultation to view and edit clinical notes
6. ✅ Test the Heidi Health mock transcription feature

## Sample Login Flow

Since there's no authentication yet, you'll have direct access to all features.

## Next Steps

Once setup is complete:

1. Explore the patient list
2. View patient details and tabs
3. Click on a consultation to see the clinical note editor
4. Try the auto-save feature in clinical notes
5. Test the mock Heidi Health transcription and note generation

Enjoy building with the Clinical Interface!
