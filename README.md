# Clinical Interface - Heidi Health Style UI

A full-stack clinical management system built with Next.js 14, featuring patient management, consultation tracking, and AI-assisted clinical note-taking.

## Features

- **Patient Management**: Complete CRUD operations for patient records
- **Consultation Tracking**: Timeline-based consultation history
- **Clinical Notes**: Auto-saving editable clinical note sections
- **Heidi Health AI Integration**: Mock transcription and structured note generation
- **Responsive Design**: Clean, professional medical dashboard UI
- **Real-time Updates**: Auto-save functionality for clinical notes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI (Radix UI)
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST endpoints

## Quick Start

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hckthn-heidibuild
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Run the setup script**
   ```bash
   npm run setup
   ```

   This will install dependencies, generate Prisma client, push schema, and seed the database.

   **OR** run each step manually:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── patients/          # Patient CRUD endpoints
│   │   ├── consultations/     # Consultation endpoints
│   │   └── heidi/             # Mock Heidi Health API
│   ├── patients/              # Patient pages
│   │   └── [id]/              # Patient detail page
│   ├── consultations/         # Consultation pages
│   │   └── [id]/              # Consultation detail page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # ShadCN UI components
│   ├── clinical-note-section.tsx
│   ├── consultations-timeline.tsx
│   ├── edit-patient-dialog.tsx
│   ├── heidi-panel.tsx
│   └── new-patient-dialog.tsx
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── types.ts               # TypeScript types
│   ├── validations.ts         # Zod schemas
│   ├── date-utils.ts          # Date utilities
│   ├── use-debounce.ts        # Debounce hook
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── docker-compose.yml         # PostgreSQL setup
└── package.json
```

## Database Schema

### Patient Model
- Demographics (name, DOB, gender)
- Contact information (phone, email, address)
- Labels/conditions
- Vitals (JSON)
- Related consultations

### Consultation Model
- Patient relationship
- Healthcare provider
- Consultation metadata (type, time, status)
- Clinical notes (chief complaint, HPI, exam, assessment, plan, follow-up)
- Heidi Health integration (transcription, structured notes)
- AI support channels (placeholders for risk alerts, guidelines, etc.)

## API Endpoints

### Patients
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/[id]` - Get patient by ID
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

### Consultations
- `GET /api/patients/[id]/consultations` - Get patient consultations
- `POST /api/patients/[id]/consultations` - Create consultation
- `GET /api/consultations/[id]` - Get consultation by ID
- `PUT /api/consultations/[id]` - Update consultation
- `DELETE /api/consultations/[id]` - Delete consultation

### Heidi Health (Mock)
- `POST /api/heidi/transcribe` - Generate mock transcription
- `POST /api/heidi/notes` - Generate mock structured notes

## Features Overview

### Patient Management
- View all patients in a searchable table
- Add new patients with comprehensive demographics
- Edit patient information
- View patient summary with vitals and labels
- Access patient consultation history

### Consultation Management
- Timeline view of all consultations
- Detailed consultation pages with metadata
- Auto-saving clinical note sections:
  - Chief Complaint
  - History of Present Illness (HPI)
  - Physical Examination
  - Assessment
  - Plan
  - Follow-up Instructions

### Heidi Health AI Integration (Mock)
- Upload/record audio simulation
- Mock transcription generation
- Structured note generation from transcription
- Auto-populate clinical note fields from AI output

### AI Support Channels (Scaffolded)
- Risk Alerts (placeholder)
- Clinical Guidelines (placeholder)
- Drug Warnings (placeholder)
- Research Notes (placeholder)
- Insurance Flags (placeholder)
- Patient Context (placeholder)

## Development

### Database Management

**View database in Prisma Studio:**
```bash
npx prisma studio
```

**Reset database:**
```bash
npx prisma db push --force-reset
npm run db:seed
```

**Create migration:**
```bash
npx prisma migrate dev --name description
```

### Building for Production

```bash
npm run build
npm start
```

## Notes

- The Heidi Health API integration is currently mocked and returns sample data
- AI support channels are scaffolded but not implemented
- Auto-save functionality debounces at 1 second
- All timestamps use date-fns for formatting

## Future Enhancements

- [ ] Real Heidi Health API integration
- [ ] Implement AI support channels
- [ ] Medications management
- [ ] Laboratory results tracking
- [ ] Imaging studies management
- [ ] Search and filtering
- [ ] Export functionality
- [ ] User authentication and authorization
- [ ] Audit logging
- [ ] HIPAA compliance features

## License

MIT
