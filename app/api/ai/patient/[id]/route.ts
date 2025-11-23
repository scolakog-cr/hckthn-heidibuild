import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the specific patient with all their consultations
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        consultations: {
          orderBy: { startTime: 'asc' }, // Chronological order for pattern recognition
        },
      },
    })

    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // ============================================
    // CUSTOMIZABLE PROMPT SECTION - Edit this part
    // ============================================
    const systemPrompt = `You are an expert clinical decision support AI helping healthcare providers prepare for patient consultations. Your role is to analyze a patient's complete medical history and provide actionable insights that will help the HCP deliver better care.

You must:
- Identify patterns across multiple visits that individual clinicians may have missed
- Flag potential diagnoses that may have been overlooked or under-treated
- Highlight connections between symptoms across different specialty visits
- Note any fragmented care issues where findings weren't properly communicated between providers
- Provide specific, actionable recommendations for today's visit
- Consider the longitudinal progression of symptoms and lab values

Be direct and clinically precise. Prioritize patient safety. If you identify a potentially missed diagnosis or under-treated condition, state it clearly.`

    const userPrompt = `Analyze this patient's complete medical history and provide a pre-consultation briefing for the HCP. This patient is scheduled for a visit today.

IMPORTANT: Look for patterns across ALL visits. Check for:
1. Symptoms that have persisted or progressed over time
2. Lab values that show trends (especially if trending in concerning directions)
3. Conditions that were noted but not adequately addressed
4. Connections between symptoms seen by different specialists
5. Any red flags or safety concerns

Patient Data:
${JSON.stringify({
  demographics: {
    name: `${patient.firstName} ${patient.lastName}`,
    dob: patient.dob,
    gender: patient.gender,
    age: calculateAge(patient.dob),
  },
  currentLabels: patient.labels,
  currentVitals: patient.vitals,
  currentMedications: patient.medications,
  allergies: patient.allergies,
  socialHistory: patient.socialHistory,
  consultationHistory: patient.consultations.map(c => ({
    date: c.startTime,
    type: c.type,
    provider: c.hcpId,
    chiefComplaint: c.chiefComplaint,
    hpi: c.hpi,
    exam: c.exam,
    assessment: c.assessment,
    plan: c.plan,
    labResults: c.structuredNotes?.labResults,
    clinicalNotes: c.structuredNotes?.clinicalNotes,
    riskAlerts: c.riskAlerts,
    followUp: c.followUp,
  })),
}, null, 2)}

Provide your analysis in this format:

## Critical Insights
[Most important findings that require immediate attention]

## Pattern Analysis
[Longitudinal patterns you've identified across visits]

## Potential Missed/Under-treated Conditions
[Any diagnoses that may have been overlooked or inadequately managed]

## Care Fragmentation Issues
[Communication gaps between providers or missed follow-ups]

## Recommended Actions for Today's Visit
[Specific, actionable recommendations]

## Key Questions to Ask the Patient
[Important questions to clarify the clinical picture]

## Lab Tests to Consider
[Any tests that would help clarify the diagnosis or monitor treatment]`

    // ============================================

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // Extract text content from response
    const analysisText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    return NextResponse.json({
      success: true,
      patientName: `${patient.firstName} ${patient.lastName}`,
      analysis: analysisText,
      consultationCount: patient.consultations.length,
      usage: message.usage,
      model: message.model,
    })
  } catch (error) {
    console.error('Error analyzing patient:', error)

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          success: false,
          error: `Anthropic API error: ${error.message}`,
          status: error.status
        },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze patient data'
      },
      { status: 500 }
    )
  }
}

function calculateAge(dob: Date): number {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
