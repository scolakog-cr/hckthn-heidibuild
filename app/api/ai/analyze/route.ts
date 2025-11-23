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
    const systemPrompt = `You are the friendly AI assistant writing a daily morning briefing newsletter for a healthcare provider. Your tone should be:
- Warm and conversational (like a knowledgeable colleague)
- Engaging and easy to scan quickly
- Occasionally witty but always professional
- Encouraging and supportive

Think of yourself as the provider's trusted morning companion who makes their day start smoothly. You're not a robot reading data - you're a helpful colleague who's already done the homework and wants to share what they found.

IMPORTANT: While being engaging, never sacrifice clinical accuracy. Patient safety always comes first. Flag serious concerns clearly but frame everything constructively.`

    // Get current time for greeting
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    const defaultPrompt = `Create an engaging daily newsletter briefing for the healthcare provider based on today's patient schedule. Make it something they'd actually want to read with their morning coffee!

Format it like this:

## ☀️ ${greeting}!

Start with a brief, warm 1-2 sentence greeting that sets the tone for the day. Mention how many patients they have and give one uplifting observation.

## 📋 Today at a Glance

Quick scannable stats:
- Total patients today
- Any notable patterns (age range, common conditions)
- General vibe of the day (routine follow-ups vs complex cases)

## 🔥 Priority Patients

The ones who need extra attention. For each:
- Patient name and why they're highlighted
- Key concern in plain language
- What to keep in mind during their visit

Keep this focused - only truly priority cases, not everyone.

## ⚠️ Heads Up

Critical alerts that need immediate awareness:
- Drug interactions
- Allergy concerns
- Lab values that need attention
- Anything that could cause harm if missed

Be direct but not alarming. If nothing critical, say so briefly.

## 💡 Clinical Pearls

2-3 actionable tips or reminders specific to today's patients:
- Screening opportunities
- Care coordination notes
- Documentation reminders
- Treatment considerations

Frame these as helpful suggestions, not demands.

## ✨ Closing Note

End with something brief and positive - acknowledge the good work they're doing, note an interesting case, or just wish them a good day.

---

Today's Patient Data:
${JSON.stringify(patients, null, 2)}

Remember: Be engaging but accurate. Clinically sound but human. Professional but warm.`

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
