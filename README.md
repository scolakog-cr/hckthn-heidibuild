# Clinical Care Partner

> **An AI companion that works alongside healthcare providers, not above them.**

---

## The Problem

Completing a clinical encounter today requires:
- Searching for information from **disparate sources**
- Executing **time-sensitive actions**
- Connecting insights to **next steps**

Current systems operate in a purely **reactive mode**, introducing latency into clinical reasoning and creating cognitive overhead as clinicians must simultaneously research, diagnose, treat, and action all the steps necessary to treat their patients.

### Why does this happen?

**Because data is missing.** Because electronic medical records are messy and stored in non-functional, non-aesthetic EMRs that make finding critical information feel like archaeology.

---

## Our Approach

LLMs are here to help. But **how do we make AI visible in a way that physicians actually want to use?**

Here's the truth: physicians aren't yet accustomed to AI-based clinical decision support tools. Many existing examples have failed to gain adoption. Why?

**Because they feel like tools, not partners.**

We need systems that act as **care partners** for patients and physicians—not data dumps they could get from ChatGPT. These systems should integrate into their workflow **kindly**, standing on their side.

> **Not on the side of pharma. Not on the side of insurance. Only on the side of HCPs and their patients.**

---

## The Solution: Three Touchpoints

We've created an AI clinical partner that meets physicians exactly when and where they need it most:

### 1. Before the Day Begins → **Awareness**

**The Daily Briefing Newsletter**

Instead of a boring data dump, physicians start their day with an engaging newsletter—something they'd actually want to read with their morning coffee.

- Warm, conversational tone (like a knowledgeable colleague)
- Scannable sections with clear visual hierarchy
- Priority patients flagged with context
- Drug interactions and allergy alerts
- Clinical pearls specific to today's panel

*"Good afternoon! You've got 6 patients on your schedule today, and I've already done my homework on them..."*

### 2. Before Each Visit → **Preparation**

**Patient-Specific AI Insights**

When the physician clicks into a patient's profile, they get a curated analysis of that specific patient's history, current concerns, and preparation notes.

- Longitudinal pattern recognition across visits
- Flagged care gaps and missed follow-ups
- Medication history and interaction warnings
- Historical context that might be buried in notes

### 3. After Each Visit → **Safety & Completeness**

**Consultation Transcript Analysis**

After the encounter, when the Heidi Health transcription is complete, the AI analyzes the session for:

- Risk alerts (substance use patterns, mood concerns)
- Clinical guideline references
- Drug warnings and contraindications
- Documentation suggestions (ICD codes, plan elements)
- Care coordination needs

This isn't just documentation—it's **malpractice prevention** and **quality assurance** that helps HCPs ensure nothing falls through the cracks.

---

## Why Physicians Will Actually Use This

Most clinical decision support fails because it feels like:
- Another alert to dismiss
- A system telling them what to do
- Data they could find themselves (but faster)

Our approach works because:

1. **It's a story, not a report** — The newsletter format makes AI feel like a helpful colleague sharing insights over coffee, not a robot spitting out data.

2. **It meets them in their workflow** — Three natural touchpoints that align with how physicians already think about their day.

3. **It's on their side** — Every insight is framed to help the physician provide better care and protect themselves, not to push protocols or pharma interests.

4. **It respects their expertise** — Suggestions, not demands. Context, not commands. The physician remains the decision-maker.

---

## Technical Implementation

### Stack
- **Next.js 14** (App Router) — React server components
- **Prisma ORM** — PostgreSQL database
- **Anthropic Claude API** — claude-sonnet-4 for analysis
- **Heidi Health Integration** — Transcription and structured notes
- **ShadCN UI** — Clean, professional interface
- **TypeScript** — Type-safe throughout

### Key Features
- Real-time AI analysis at three touchpoints
- Rich patient data model (vitals, medications, allergies, social history)
- Consultation timeline with clinical notes
- Editable clinical note sections
- Structured transcription display

### Data Model
- **Patients** — Demographics, vitals, medications, allergies, insurance, social history
- **Consultations** — Clinical notes (SOAP format), transcriptions, AI analysis results, risk alerts

---

## Demo Scenario: Alex Morgan

The demo showcases a patient with a complex 5-year medical history:

- **Evolving hypothyroidism** that's been flagged repeatedly but never treated
- **Fragmented care** across primary care, urgent care, and gynecology
- **Pattern recognition** — the AI connects symptoms across multiple visits that individual providers missed
- **Today's session** — A therapy follow-up with full Heidi transcription and structured notes

The AI identifies that Alex's fatigue, mood symptoms, and menstrual irregularities are likely all connected to untreated hypothyroidism (TSH 7.8), which has been noted but never addressed across 5 years of visits with different providers.

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY and DATABASE_URL

# Push database schema
npx prisma db push

# Seed demo data
npm run db:seed

# Run development server
npm run dev
```

Visit `http://localhost:3000` to explore:
- **Dashboard** — Daily schedule with newsletter button
- **Patient profiles** — Individual AI insights
- **Consultations** — Transcript analysis and clinical notes

---

## The Vision

We believe clinical AI should be:

- **Invisible when not needed** — No alert fatigue, no pop-ups
- **Present when it matters** — The right insight at the right moment
- **Trustworthy** — Clinically accurate, never overstepping
- **Human** — Warm, conversational, encouraging

The best tools feel like extensions of yourself. That's what we're building—an AI that makes physicians feel supported, not surveilled. Prepared, not pressured. Confident, not second-guessed.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/                   # AI analysis endpoints
│   │   │   ├── analyze/          # Daily panel analysis
│   │   │   ├── patient/[id]/     # Patient-specific insights
│   │   │   └── consultation/[id]/ # Transcript analysis
│   │   ├── patients/             # Patient CRUD
│   │   └── consultations/        # Consultation endpoints
│   ├── patients/[id]/            # Patient detail page
│   └── consultations/[id]/       # Consultation detail page
├── components/
│   ├── ai-insights-panel.tsx     # Daily newsletter UI
│   ├── patient-insights-panel.tsx # Patient-specific insights UI
│   ├── consultation-ai-support.tsx # Post-visit analysis UI
│   └── heidi-panel.tsx           # Heidi integration
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Demo data with Alex Morgan
└── lib/
    └── prisma.ts                 # Database client
```

---

## Team

Built for Heidi Health Hackathon 2024

---

*"The goal isn't to replace physician judgment—it's to make sure they have everything they need to exercise it brilliantly."*
