import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// POST: Analyze transcript and return clinical decision support
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { transcript } = body

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Transcript is required' },
        { status: 400 }
      )
    }

    // Get the consultation with patient data and history
    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          include: {
            consultations: {
              orderBy: { startTime: 'asc' },
              where: {
                id: { not: params.id } // Exclude current consultation
              }
            }
          }
        }
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { success: false, error: 'Consultation not found' },
        { status: 404 }
      )
    }

    const patient = consultation.patient

    // ============================================
    // CUSTOMIZABLE PROMPT SECTION - Edit this part
    // ============================================
    const systemPrompt = `You are an expert clinical decision support AI providing real-time assistance during patient consultations. Your role is to analyze the consultation transcript in the context of the patient's complete medical history and provide actionable clinical intelligence.

You must provide structured output in three key areas:

1. **Risk Alerts**: Safety-critical information the physician needs to know immediately
   - Missed diagnoses that should be addressed
   - Lab values requiring urgent attention
   - Symptom patterns suggesting serious conditions
   - Patient safety concerns

2. **Clinical Guidelines**: Evidence-based recommendations relevant to what's being discussed
   - Current treatment guidelines for identified conditions
   - Diagnostic criteria being met or approached
   - Standard of care recommendations
   - Referral criteria

3. **Drug Warnings**: Medication-related alerts
   - Potential drug interactions
   - Contraindications based on patient conditions
   - Dosing considerations
   - Allergy cross-reactivity concerns

Be direct, specific, and prioritize patient safety. Reference specific findings from the patient's history and the current transcript.`

    const userPrompt = `Analyze this consultation transcript and provide clinical decision support.

PATIENT CONTEXT:
Name: ${patient.firstName} ${patient.lastName}
Age: ${calculateAge(patient.dob)} years old
Gender: ${patient.gender}

Current Labels/Conditions: ${patient.labels.join(', ')}

Current Medications: ${JSON.stringify(patient.medications || [], null, 2)}

Allergies: ${patient.allergies.length > 0 ? patient.allergies.join(', ') : 'No known allergies'}

Current Vitals: ${JSON.stringify(patient.vitals || {}, null, 2)}

CONSULTATION HISTORY (${patient.consultations.length} previous visits):
${patient.consultations.map(c => `
---
Date: ${c.startTime ? new Date(c.startTime).toLocaleDateString() : 'Unknown'}
Type: ${c.type}
Provider: ${c.hcpId}
Chief Complaint: ${c.chiefComplaint || 'Not recorded'}
Assessment: ${c.assessment || 'Not recorded'}
Lab Results: ${c.structuredNotes?.labResults ? JSON.stringify(c.structuredNotes.labResults) : 'None recorded'}
Risk Alerts: ${c.riskAlerts ? JSON.stringify(c.riskAlerts) : 'None'}
`).join('\n')}

PRE-CONSULTATION CONTEXT:
${consultation.patientContext ? JSON.stringify(consultation.patientContext, null, 2) : 'None provided'}

CURRENT CONSULTATION TRANSCRIPT:
${transcript}

---

Based on the transcript and patient history, provide clinical decision support in the following JSON format:

{
  "riskAlerts": [
    {
      "severity": "high|medium|low",
      "category": "missed diagnosis|urgent lab|safety concern|symptom pattern",
      "title": "Brief alert title",
      "description": "Detailed explanation",
      "evidence": "What in the transcript/history supports this",
      "recommendation": "Specific action to take"
    }
  ],
  "clinicalGuidelines": [
    {
      "condition": "Condition name",
      "guideline": "Guideline name/source",
      "relevance": "Why this applies to current discussion",
      "keyPoints": ["Point 1", "Point 2"],
      "recommendation": "Specific recommendation based on guidelines"
    }
  ],
  "drugWarnings": [
    {
      "severity": "high|medium|low",
      "type": "interaction|contraindication|allergy|dosing",
      "drugs": ["Drug 1", "Drug 2"],
      "warning": "Description of the warning",
      "recommendation": "What to do about it"
    }
  ],
  "suggestedActions": [
    "Immediate action 1",
    "Immediate action 2"
  ],
  "documentationSuggestions": {
    "diagnosis": "Suggested diagnosis based on discussion",
    "icdCodes": ["ICD-10 code 1", "ICD-10 code 2"],
    "planElements": ["Plan element 1", "Plan element 2"]
  }
}

Return ONLY valid JSON. Be thorough but prioritize the most clinically significant findings.`

    // ============================================

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // Extract text content from response
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    // Parse the JSON response
    let analysis
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      // Return raw text if JSON parsing fails
      analysis = {
        rawResponse: responseText,
        parseError: 'Failed to parse structured response'
      }
    }

    // Optionally update the consultation with the analysis
    await prisma.consultation.update({
      where: { id: params.id },
      data: {
        transcriptionText: transcript,
        riskAlerts: analysis.riskAlerts || null,
        guidelineRefs: analysis.clinicalGuidelines || null,
        drugWarnings: analysis.drugWarnings || null,
        structuredNotes: {
          ...(consultation.structuredNotes as object || {}),
          aiAnalysis: analysis,
          analyzedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      success: true,
      consultationId: params.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      analysis,
      usage: message.usage,
      model: message.model,
    })
  } catch (error) {
    console.error('Error analyzing consultation:', error)

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
        error: 'Failed to analyze consultation'
      },
      { status: 500 }
    )
  }
}

// GET: Retrieve existing analysis for a consultation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id: params.id },
      include: {
        patient: true
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { success: false, error: 'Consultation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      consultation: {
        id: consultation.id,
        patientName: `${consultation.patient.firstName} ${consultation.patient.lastName}`,
        type: consultation.type,
        status: consultation.status,
        startTime: consultation.startTime,
        chiefComplaint: consultation.chiefComplaint,
        transcriptionText: consultation.transcriptionText,
        riskAlerts: consultation.riskAlerts,
        guidelineRefs: consultation.guidelineRefs,
        drugWarnings: consultation.drugWarnings,
        structuredNotes: consultation.structuredNotes,
        patientContext: consultation.patientContext
      }
    })
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultation' },
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
