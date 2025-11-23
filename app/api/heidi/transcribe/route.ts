import { NextRequest, NextResponse } from 'next/server'

// POST /api/heidi/transcribe - Mock transcription endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audioFile, consultationId } = body

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return mock transcription
    const mockTranscription = {
      transcriptionId: `trans_${Date.now()}`,
      consultationId,
      text: `[Mock Transcription]

Doctor: Good morning! How are you feeling today?

Patient: I've been experiencing some shortness of breath, especially when climbing stairs.

Doctor: I see. When did this start?

Patient: About two weeks ago. It's been getting progressively worse.

Doctor: Have you experienced any chest pain or palpitations?

Patient: No chest pain, but I do feel my heart racing sometimes.

Doctor: Let me listen to your lungs and heart. [Examination sounds] Your lungs sound clear. Heart rate is slightly elevated. Let's check your blood pressure.

Patient: Is everything okay?

Doctor: Your blood pressure is 145/92, which is a bit high. Combined with the shortness of breath, I'd like to run some tests. We'll do an EKG and some blood work to rule out any cardiac issues.

Patient: Okay, that sounds good.

Doctor: In the meantime, try to avoid strenuous activities. If the symptoms worsen or you experience chest pain, please go to the emergency room immediately.

Patient: I understand. Thank you, doctor.

Doctor: We'll schedule a follow-up once we get your test results back.`,
      status: 'completed',
      duration: 420, // seconds
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(mockTranscription)
  } catch (error) {
    console.error('Error processing transcription:', error)
    return NextResponse.json(
      { error: 'Failed to process transcription' },
      { status: 500 }
    )
  }
}
