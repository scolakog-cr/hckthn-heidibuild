import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Get all patients with their consultations
    const patients = await prisma.patient.findMany({
      include: {
        consultations: {
          orderBy: { startTime: 'desc' },
          take: 3, // Last 3 consultations per patient
        },
      },
    })

    // Get custom prompt from request body (optional)
    const body = await request.json().catch(() => ({}))
    const { customPrompt } = body

    // ============================================
    // CUSTOMIZABLE PROMPT SECTION - Edit this part
    // ============================================
    const systemPrompt = `You are a clinical assistant AI helping healthcare providers analyze patient data. You are viewing HCP's patients planned visit for today. 
Be concise, accurate, and highlight any important clinical considerations.
Focus on actionable insights that would help a physician manage their patient panel effectively.
Always consider patient safety, drug interactions, and allergy warnings.`

    const defaultPrompt = `Analyze the following patient panel data and provide:

1. **Patient Panel Overview**: Brief summary of demographics and common conditions
2. **High Priority Patients**: Identify patients who may need immediate attention based on their conditions, vitals, or medications
3. **Drug Interaction Alerts**: Flag any potential drug interactions or allergy concerns
4. **Care Gaps**: Identify any patients who may be overdue for follow-ups or screenings
5. **Clinical Recommendations**: Brief actionable recommendations for the care team

Today's Patient Data:
${JSON.stringify(patients, null, 2)}`

    const userPrompt = customPrompt || defaultPrompt
    // ============================================

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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
      analysis: analysisText,
      usage: message.usage,
      model: message.model,
    })
  } catch (error) {
    console.error('Error analyzing patients:', error)

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

// GET endpoint to check if the API is configured
export async function GET() {
  const isConfigured = !!process.env.ANTHROPIC_API_KEY

  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured
      ? 'Anthropic API is configured. Use POST to analyze patients.'
      : 'ANTHROPIC_API_KEY not found in environment variables.',
  })
}
